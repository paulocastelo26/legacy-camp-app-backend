import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Inscricao } from '../inscricoes/entities/inscricao.entity';
import * as fs from 'fs';
import * as path from 'path';
import { google } from 'googleapis';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private gmail: any;

  constructor(private configService: ConfigService) {
    this.initializeGmailAPI();
  }

  async sendPaymentInstructionEmail(
    inscricao: Inscricao,
    options?: { paymentLink?: string }
  ): Promise<boolean> {
    return await this.sendEmail(
      inscricao,
      '📌 Instruções de pagamento - Legacy Camp',
      this.generatePaymentInstructionEmailHTML(inscricao, options)
    );
  }

  async sendContractEmail(inscricao: Inscricao): Promise<boolean> {
    return await this.sendEmailWithAttachment(
      inscricao,
      '📄 Contrato de Participação - Legacy Camp',
      this.generateContractEmailHTML(inscricao),
      'CONTRATO.pdf'
    );
  }

  async sendWelcomeEmail(inscricao: Inscricao): Promise<boolean> {
    return await this.sendEmail(
      inscricao,
      '🎉 Bem-vindo ao Legacy Camp!',
      this.generateWelcomeEmailHTML(inscricao)
    );
  }

  async sendStatusUpdateEmail(inscricao: Inscricao, newStatus: string): Promise<boolean> {
    return await this.sendEmail(
      inscricao,
      `📊 Atualização de Status - Legacy Camp`,
      this.generateStatusUpdateEmailHTML(inscricao, newStatus)
    );
  }

  async sendCustomEmail(inscricao: Inscricao, subject: string, message: string): Promise<boolean> {
    return await this.sendEmail(
      inscricao,
      subject,
      this.generateCustomEmailHTML(inscricao, message)
    );
  }

  private initializeGmailAPI() {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const googleClientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const googleRefreshToken = this.configService.get<string>('GOOGLE_REFRESH_TOKEN');

    this.logger.log(`🔧 Inicializando Gmail API...`);

    if (!googleClientId || !googleClientSecret || !googleRefreshToken) {
      this.logger.error(`❌ Configuração Gmail API incompleta!`);
      this.logger.error(`Configure: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN`);
      return;
    }

    const oauth2Client = new google.auth.OAuth2(
      googleClientId,
      googleClientSecret,
      'urn:ietf:wg:oauth:2.0:oob'
    );

    oauth2Client.setCredentials({
      refresh_token: googleRefreshToken,
    });

    this.gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    this.logger.log(`✅ Gmail API inicializada com sucesso`);
  }

  private async sendEmail(inscricao: Inscricao, subject: string, htmlContent: string): Promise<boolean> {
    if (!this.gmail) {
      this.logger.error(`❌ Gmail API não inicializada!`);
      return false;
    }

    try {
      this.logger.log(`📧 Enviando email para ${inscricao.email}: ${subject}`);
      
      const emailUser = this.configService.get<string>('EMAIL_USER');
      
      const emailLines = [
        `From: "Legacy Camp" <${emailUser}>`,
        `To: ${inscricao.email}`,
        `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
        `Content-Type: text/html; charset=utf-8`,
        ``,
        htmlContent
      ].join('\n');

      const encodedEmail = Buffer.from(emailLines).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const result = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedEmail,
        },
      });
      
      this.logger.log(`✅ Email enviado com sucesso para ${inscricao.email}`);
      this.logger.debug(`📧 Message ID: ${result.data.id}`);
      
      return true;
    } catch (error) {
      this.logger.error(`❌ Erro ao enviar email para ${inscricao.email}: ${error.message}`);
      
      // Se for erro de token inválido, orientar sobre regeneração
      if (error.message.includes('invalid_grant')) {
        this.logger.warn(`🔄 Refresh token inválido detectado. Precisa regenerar tokens.`);
        this.logger.warn(`📋 Use /email/auth-url para gerar nova URL de autorização`);
        this.logger.warn(`📋 Depois use /email/exchange-code/:code para obter novo refresh token`);
      }
      
      return false;
    }
  }

  private async sendEmailWithAttachment(inscricao: Inscricao, subject: string, htmlContent: string, attachmentFilename: string): Promise<boolean> {
    if (!this.gmail) {
      this.logger.error(`❌ Gmail API não inicializada!`);
      return false;
    }

    try {
      this.logger.log(`📧 Enviando email com anexo para ${inscricao.email}: ${subject}`);
      
      const emailUser = this.configService.get<string>('EMAIL_USER');
      
      // Determinar o caminho correto baseado no ambiente
      let attachmentPath: string;
      const possiblePaths = [];
      
      if (process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production') {
        // No Railway/produção, tentar múltiplos caminhos
        possiblePaths.push(
          path.join(__dirname, '..', '..', 'public', attachmentFilename),
          path.join(__dirname, '..', 'assets', 'CONTRATO.pdf'),
          path.join(process.cwd(), 'public', attachmentFilename),
          path.join(process.cwd(), 'dist', 'public', attachmentFilename)
        );
      } else {
        // Em desenvolvimento local
        possiblePaths.push(
          path.join(process.cwd(), 'public', attachmentFilename),
          path.join(__dirname, '..', 'assets', 'CONTRATO.pdf')
        );
      }
      
      // Encontrar o primeiro caminho que existe
      attachmentPath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
      
      this.logger.log(`🔍 Procurando arquivo em: ${attachmentPath}`);
      this.logger.log(`🔍 Caminhos testados: ${possiblePaths.join(', ')}`);
      
      // Verificar se o arquivo existe
      if (!fs.existsSync(attachmentPath)) {
        this.logger.error(`❌ Arquivo de anexo não encontrado: ${attachmentPath}`);
        
        // Listar arquivos disponíveis para debug
        const publicDir = path.dirname(attachmentPath);
        if (fs.existsSync(publicDir)) {
          const files = fs.readdirSync(publicDir);
          this.logger.log(`📁 Arquivos disponíveis em ${publicDir}:`);
          files.forEach(file => this.logger.log(`  - ${file}`));
        } else {
          this.logger.error(`❌ Diretório public não encontrado: ${publicDir}`);
        }
        
        return false;
      }

      // Ler o arquivo
      const attachmentData = fs.readFileSync(attachmentPath);
      const attachmentBase64 = attachmentData.toString('base64');

      // Criar boundary único
      const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Construir o email multipart
      const emailParts = [
        `From: "Legacy Camp" <${emailUser}>`,
        `To: ${inscricao.email}`,
        `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: text/html; charset=utf-8`,
        `Content-Transfer-Encoding: 7bit`,
        ``,
        htmlContent,
        ``,
        `--${boundary}`,
        `Content-Type: application/pdf`,
        `Content-Disposition: attachment; filename*=UTF-8''${encodeURIComponent(attachmentFilename)}`,
        `Content-Transfer-Encoding: base64`,
        ``,
        attachmentBase64,
        ``,
        `--${boundary}--`
      ].join('\n');

      const encodedEmail = Buffer.from(emailParts).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const result = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedEmail,
        },
      });
      
      this.logger.log(`✅ Email com anexo enviado com sucesso para ${inscricao.email}`);
      this.logger.debug(`📧 Message ID: ${result.data.id}`);
      this.logger.debug(`📎 Anexo: ${attachmentFilename}`);
      
      return true;
    } catch (error) {
      this.logger.error(`❌ Erro ao enviar email com anexo para ${inscricao.email}: ${error.message}`);
      
      // Se for erro de token inválido, tentar regenerar
      if (error.message.includes('invalid_grant')) {
        this.logger.warn(`🔄 Refresh token inválido detectado. Precisa regenerar tokens.`);
        this.logger.warn(`📋 Use /email/auth-url para gerar nova URL de autorização`);
        this.logger.warn(`📋 Depois use /email/exchange-code/:code para obter novo refresh token`);
      }
      
      return false;
    }
  }

  private generatePaymentInstructionEmailHTML(inscricao: Inscricao, options?: { paymentLink?: string }): string {
    const paymentMethod = (inscricao.paymentMethod || '').toLowerCase();

    const methodLabel =
      paymentMethod === 'cartao' ? 'Cartão de crédito' :
      paymentMethod === 'pix' ? 'PIX' :
      paymentMethod === 'carne' ? 'Carnê Legacy' :
      inscricao.paymentMethod;

    const baseHeader = `
      <div class="header">
        <h1>🎉 Parabéns por se inscrever no Legacy Camp!</h1>
      </div>
      <div class="content">
        <h2>Olá, ${inscricao.fullName}!</h2>
        <p>Seja bem-vindo ao Legacy Camp! Temos certeza de que sua presença será marcante, pois Deus preparou algo especial para você nestes dias. Serão momentos de poderosa presença dEle e de comunhão entre os irmãos.</p>
        <div class="highlight">
          <p><strong>Status do pagamento:</strong> Pendente</p>
          <p><strong>Forma de pagamento selecionada:</strong> ${methodLabel}</p>
        </div>
    `;

    let specificBlock = '';

    if (paymentMethod === 'cartao') {
      const link = options?.paymentLink || 'https://mpago.la/22L9ag7';
      specificBlock = `
        <p>Finalize o pagamento no link abaixo:</p>
        <p><a href="${link}" target="_blank">🔗 Clique aqui para pagar</a></p>
      `;
    } else if (paymentMethod === 'pix') {
      specificBlock = `
        <p>Finalize o pagamento abaixo: <strong>PIX</strong>.</p>
        <div class="pix-box">pix.legacy.am@gmail.com</div>
        <p><em>Observação: Caso o pagamento ainda não tenha sido realizado, por favor, ignore esta mensagem.</em></p>
      `;
    } else if (paymentMethod === 'carne') {
      specificBlock = `
        <p>Você escolheu o <strong>Carnê Legacy</strong> como forma de pagamento.</p>
        <p>Nossa equipe entrará em contato em breve para processar a primeira parcela.</p>
      `;
    } else {
      specificBlock = `
        <p>Forma de pagamento não reconhecida. Por favor, entre em contato com nossa equipe.</p>
      `;
    }

    const supportBlock = `
        <div class="support">
          <p><strong>Precisa de ajuda? Fale conosco:</strong></p>
          <p>📞 Telefone: +55 92 8409-5783<br>✉ E-mail: lgcymanaus@gmail.com</p>
          <p>Estamos à disposição para qualquer dúvida. Deus abençoe sua jornada até o acampamento!</p>
        </div>
      </div>
    `;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Instruções de Pagamento - Legacy Camp</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .pix-box { background: #fff; padding: 12px 16px; border: 1px dashed #667eea; display: inline-block; border-radius: 6px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          ${baseHeader}
          ${specificBlock}
          ${supportBlock}
          <div class="footer">
            <p>Legacy Camp - Transformando vidas através de experiências únicas</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateContractEmailHTML(inscricao: Inscricao): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Contrato de Participação - Legacy Camp</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .highlight { background: #e74c3c; color: white; padding: 10px; margin: 10px 0; }
          .info-box { background: #ecf0f1; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; }
          .support { background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3498db; }
          .footer { text-align: center; padding: 20px; color: #7f8c8d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏕️ Legacy Camp</h1>
            <h2>Contrato de Participação</h2>
          </div>
          
          <div class="content">
            <p>Olá <strong>${inscricao.fullName}</strong>!</p>
            
            <p>Segue em anexo o contrato de participação do Legacy Camp.</p>
            
            <div class="highlight">
              <h3>📋 Dados da Inscrição</h3>
              <p><strong>Nome:</strong> ${inscricao.fullName}</p>
              <p><strong>Email:</strong> ${inscricao.email}</p>
              <p><strong>Status:</strong> ${inscricao.status}</p>
            </div>
            
            <div class="info-box">
              <h3>📄 Contrato de Participação</h3>
              <p>Por favor, leia atentamente o contrato de participação anexo e mantenha uma cópia para seus registros.</p>
            </div>

            <div class="support">
              <p><strong>Precisa de ajuda? Fale conosco:</strong></p>
              <p>📞 Telefone: +55 92 8409-5783<br>✉ E-mail: lgcymanaus@gmail.com</p>
              <p>Estamos à disposição para qualquer dúvida. Deus abençoe sua jornada até o acampamento!</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Legacy Camp - Transformando vidas através de experiências únicas</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateWelcomeEmailHTML(inscricao: Inscricao): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Bem-vindo ao Legacy Camp!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .highlight { background: #e74c3c; color: white; padding: 10px; margin: 10px 0; }
          .info-box { background: #ecf0f1; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; }
          .support { background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3498db; }
          .footer { text-align: center; padding: 20px; color: #7f8c8d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Legacy Camp</h1>
            <h2>Bem-vindo!</h2>
          </div>
          
          <div class="content">
            <p>Olá <strong>${inscricao.fullName}</strong>!</p>
            
            <p>Seja muito bem-vindo ao Legacy Camp! Estamos muito felizes em tê-lo conosco nesta jornada transformadora.</p>
            
            <div class="highlight">
              <h3>🎯 O que esperar</h3>
              <p>Uma experiência única de crescimento pessoal, espiritual e comunitário.</p>
            </div>
            
            <div class="info-box">
              <h3>📋 Próximos Passos</h3>
              <p>Em breve você receberá mais informações sobre:</p>
              <ul>
                <li>Programação detalhada</li>
                <li>Lista de itens necessários</li>
                <li>Orientações de chegada</li>
                <li>Contato da equipe</li>
              </ul>
            </div>

            <div class="support">
              <p><strong>Precisa de ajuda? Fale conosco:</strong></p>
              <p>📞 Telefone: +55 92 8409-5783<br>✉ E-mail: lgcymanaus@gmail.com</p>
              <p>Estamos à disposição para qualquer dúvida. Deus abençoe sua jornada até o acampamento!</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Legacy Camp - Transformando vidas através de experiências únicas</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateStatusUpdateEmailHTML(inscricao: Inscricao, newStatus: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Atualização de Status - Legacy Camp</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f39c12; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .highlight { background: #e74c3c; color: white; padding: 10px; margin: 10px 0; }
          .info-box { background: #ecf0f1; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; }
          .support { background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3498db; }
          .footer { text-align: center; padding: 20px; color: #7f8c8d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Legacy Camp</h1>
            <h2>Atualização de Status</h2>
          </div>
          
          <div class="content">
            <p>Olá <strong>${inscricao.fullName}</strong>!</p>
            
            <p>Seu status de inscrição foi atualizado.</p>
            
            <div class="highlight">
              <h3>📋 Status Atualizado</h3>
              <p><strong>Novo Status:</strong> ${newStatus}</p>
              <p><strong>Nome:</strong> ${inscricao.fullName}</p>
              <p><strong>Email:</strong> ${inscricao.email}</p>
            </div>
            
            <div class="support">
              <p><strong>Precisa de ajuda? Fale conosco:</strong></p>
              <p>📞 Telefone: +55 92 8409-5783<br>✉ E-mail: lgcymanaus@gmail.com</p>
              <p>Estamos à disposição para qualquer dúvida. Deus abençoe sua jornada até o acampamento!</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Legacy Camp - Transformando vidas através de experiências únicas</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateCustomEmailHTML(inscricao: Inscricao, message: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Mensagem - Legacy Camp</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #9b59b6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .highlight { background: #e74c3c; color: white; padding: 10px; margin: 10px 0; }
          .info-box { background: #ecf0f1; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; }
          .support { background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3498db; }
          .footer { text-align: center; padding: 20px; color: #7f8c8d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💌 Legacy Camp</h1>
            <h2>Mensagem Personalizada</h2>
          </div>
          
          <div class="content">
            <p>Olá <strong>${inscricao.fullName}</strong>!</p>
            
            <div class="info-box">
              <h3>📝 Mensagem</h3>
              <p>${message}</p>
            </div>
            
            <div class="highlight">
              <h3>📋 Dados da Inscrição</h3>
              <p><strong>Nome:</strong> ${inscricao.fullName}</p>
              <p><strong>Email:</strong> ${inscricao.email}</p>
              <p><strong>Status:</strong> ${inscricao.status}</p>
            </div>

            <div class="support">
              <p><strong>Precisa de ajuda? Fale conosco:</strong></p>
              <p>📞 Telefone: +55 92 8409-5783<br>✉ E-mail: lgcymanaus@gmail.com</p>
              <p>Estamos à disposição para qualquer dúvida. Deus abençoe sua jornada até o acampamento!</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Legacy Camp - Transformando vidas através de experiências únicas</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}