import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Inscricao } from '../inscricoes/entities/inscricao.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeEmailService();
  }

  async sendPaymentInstructionEmail(
    inscricao: Inscricao,
    options?: { paymentLink?: string }
  ): Promise<boolean> {
    return await this.sendEmailWithRetry(
      inscricao,
      '📌 Instruções de pagamento - Legacy Camp',
      this.generatePaymentInstructionEmailHTML(inscricao, options),
      'instruções de pagamento'
    );
  }

  private initializeEmailService() {
    this.logger.log(`🔧 Inicializando serviço de email...`);
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    // Configuração específica para Railway e produção
    if (nodeEnv === 'production' || process.env.RAILWAY_ENVIRONMENT) {
      this.logger.log(`🚂 Configuração SMTP otimizada para Railway`);
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, // Usar porta 465 (SSL) em vez de 587
        secure: true, // SSL obrigatório
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
        connectionTimeout: 60000, // 60 segundos
        greetingTimeout: 30000,   // 30 segundos
        socketTimeout: 60000,     // 60 segundos
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3',
          servername: 'smtp.gmail.com'
        },
        pool: false, // Desabilitar pool para Railway
        maxConnections: 1,
        maxMessages: 1,
        rateDelta: 60000, // 60 segundos entre envios
        rateLimit: 1,     // máximo 1 email por período
        debug: false,
        logger: false,
      } as nodemailer.TransportOptions);
    } else {
      this.logger.log(`💻 Configuração SMTP para desenvolvimento local`);
      
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3'
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 20000,
        rateLimit: 5,
      } as nodemailer.TransportOptions);
    }

    // Verificar conexão na inicialização
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(`🔍 Tentativa ${attempt}/${maxRetries} - Verificando conexão com servidor de email...`);
        
        await this.transporter.verify();
        this.logger.log('✅ Conexão com servidor de email verificada com sucesso');
        return;
      } catch (error) {
        lastError = error;
        this.logger.error(`❌ Tentativa ${attempt}/${maxRetries} falhou: ${error.message}`);
        
        if (attempt < maxRetries) {
          const delay = attempt * 2000; // 2s, 4s, 6s
          this.logger.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
          await this.sleep(delay);
        }
      }
    }

    this.logger.error(`💥 Falha ao verificar conexão após ${maxRetries} tentativas`);
    this.logger.error(`🔍 Último erro: ${lastError?.message}`);
    this.logger.warn(`⚠️ O serviço continuará funcionando, mas emails podem falhar`);
    this.logger.warn(`🔧 Verifique as configurações EMAIL_USER e EMAIL_PASSWORD`);
  }

  async sendContractEmail(
    inscricao: Inscricao,
    options?: { contractUrl?: string; contractPath?: string; filename?: string }
  ): Promise<boolean> {
    try {
      const fallbackUrl = this.configService.get<string>('CONTRACT_PDF_URL');
      const fallbackPath = this.configService.get<string>('CONTRACT_PDF_PATH');
      const filename = options?.filename || 'Contrato Legacy Camp.pdf';

      let attachmentSource = options?.contractUrl || fallbackUrl || options?.contractPath || fallbackPath;

      // Fallback: procurar arquivo padrão na pasta public com o nome informado pelo usuário
      if (!attachmentSource) {
        const defaultPublicPath = path.resolve(
          process.cwd(),
          'public',
          'CONTRATO PARTICIPAÇÃO LEGACY CAMP MANAUS 25.pdf'
        );
        if (fs.existsSync(defaultPublicPath)) {
          attachmentSource = defaultPublicPath;
        }
      }

      if (!attachmentSource) {
        throw new Error('Caminho/URL do contrato PDF não configurado. Defina CONTRACT_PDF_URL ou CONTRACT_PDF_PATH, ou informe via request.');
      }

      const mailOptions = {
        from: `"Legacy Camp" <${this.configService.get<string>('EMAIL_USER')}>`,
        to: inscricao.email,
        subject: '📄 Contrato - Legacy Camp',
        html: this.generateContractEmailHTML(inscricao),
        attachments: [
          {
            filename,
            path: attachmentSource,
          },
        ],
      } as nodemailer.SendMailOptions;

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Contrato enviado para ${inscricao.email}`);
      return true;
    } catch (error) {
      this.logger.error(`Erro ao enviar contrato: ${error.message}`);
      return false;
    }
  }

  async sendWelcomeEmail(inscricao: Inscricao): Promise<boolean> {
    return await this.sendEmailWithRetry(
      inscricao,
      '🎉 Bem-vindo ao Legacy Camp!',
      this.generateWelcomeEmailHTML(inscricao),
      'boas-vindas'
    );
  }

  async sendStatusUpdateEmail(inscricao: Inscricao, newStatus: string): Promise<boolean> {
    return await this.sendEmailWithRetry(
      inscricao,
      `📋 Atualização de Status - Legacy Camp`,
      this.generateStatusUpdateEmailHTML(inscricao, newStatus),
      'atualização de status'
    );
  }

  async sendCustomEmail(inscricao: Inscricao, subject: string, message: string): Promise<boolean> {
    return await this.sendEmailWithRetry(
      inscricao,
      subject,
      this.generateCustomEmailHTML(inscricao, message),
      'personalizado'
    );
  }

  private async sendEmailWithRetry(
    inscricao: Inscricao,
    subject: string,
    htmlContent: string,
    emailType: string,
    maxRetries: number = 3
  ): Promise<boolean> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(`📧 Tentativa ${attempt}/${maxRetries} - Enviando email de ${emailType} para ${inscricao.email}`);

        // Usar SMTP otimizado
        const mailOptions = {
          from: `"Legacy Camp" <${this.configService.get<string>('EMAIL_USER')}>`,
          to: inscricao.email,
          subject: subject,
          html: htmlContent,
        };

        const result = await this.transporter.sendMail(mailOptions);
        
        this.logger.log(`✅ Email de ${emailType} enviado com sucesso via SMTP para ${inscricao.email} (tentativa ${attempt})`);
        this.logger.debug(`📧 Message ID: ${result.messageId}`);
        
        return true;
      } catch (error) {
        lastError = error;
        this.logger.error(`❌ Tentativa ${attempt}/${maxRetries} falhou para ${inscricao.email}: ${error.message}`);
        
        // Se for erro de conexão SMTP, tentar recriar o transporter
        if (error.message.includes('Connection timeout') || error.message.includes('ECONNRESET')) {
          this.logger.warn(`🔄 Erro de conexão SMTP detectado, tentando recriar transporter...`);
          await this.recreateTransporter();
        }
        
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
          this.logger.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
          await this.sleep(delay);
        }
      }
    }

    this.logger.error(`💥 Falha definitiva ao enviar email de ${emailType} para ${inscricao.email} após ${maxRetries} tentativas`);
    this.logger.error(`🔍 Último erro: ${lastError?.message}`);
    
    return false;
  }

  private async recreateTransporter(): Promise<void> {
    try {
      this.logger.log(`🔄 Recriando transporter de email...`);
      
      // Fechar conexões existentes
      if (this.transporter) {
        this.transporter.close();
      }
      
      // Aguardar um pouco antes de recriar
      await this.sleep(2000);
      
      // Recriar transporter
      this.initializeTransporter();
      
      this.logger.log(`✅ Transporter recriado com sucesso`);
    } catch (error) {
      this.logger.error(`❌ Erro ao recriar transporter: ${error.message}`);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateWelcomeEmailHTML(inscricao: Inscricao): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Bem-vindo ao Legacy Camp</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bem-vindo ao Legacy Camp!</h1>
            <p>Sua inscrição foi recebida com sucesso</p>
          </div>
          <div class="content">
            <h2>Olá, ${inscricao.fullName}!</h2>
            <p>Estamos muito felizes em receber sua inscrição para o Legacy Camp!</p>
            
            <div class="highlight">
              <h3>📋 Detalhes da sua inscrição:</h3>
              <p><strong>Nome:</strong> ${inscricao.fullName}</p>
              <p><strong>Email:</strong> ${inscricao.email}</p>
              <p><strong>Lote:</strong> ${inscricao.registrationLot}</p>
              <p><strong>Status:</strong> ${inscricao.status}</p>
            </div>

            <h3>📅 Próximos passos:</h3>
            <ul>
              <li>Aguarde a confirmação de pagamento</li>
              <li>Você receberá atualizações por email</li>
              <li>Prepare-se para uma experiência incrível!</li>
            </ul>

            <p>Se você tiver alguma dúvida, não hesite em nos contatar.</p>
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
    const statusMessages = {
      'APROVADA': 'Sua inscrição foi aprovada! 🎉',
      'REPROVADA': 'Sua inscrição foi reprovada.',
      'PENDENTE': 'Sua inscrição está em análise.',
      'CANCELADA': 'Sua inscrição foi cancelada.'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Atualização de Status - Legacy Camp</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .status { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Atualização de Status</h1>
            <p>Legacy Camp</p>
          </div>
          <div class="content">
            <h2>Olá, ${inscricao.fullName}!</h2>
            
            <div class="status">
              <h3>${statusMessages[newStatus] || 'Status atualizado'}</h3>
              <p><strong>Novo Status:</strong> ${newStatus}</p>
            </div>

            <p>O status da sua inscrição foi atualizado. Mantenha-se atento aos próximos comunicados.</p>
          </div>
          <div class="footer">
            <p>Legacy Camp - Transformando vidas através de experiências únicas</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generatePaymentInstructionEmailHTML(
    inscricao: Inscricao,
    options?: { paymentLink?: string }
  ): string {
    const paymentMethod = (inscricao.paymentMethod || '').toLowerCase();

    const methodLabel =
      paymentMethod === 'cartao'
        ? 'Cartão de crédito'
        : paymentMethod === 'pix'
        ? 'PIX'
        : paymentMethod === 'carne'
        ? 'Carnê Legacy'
        : inscricao.paymentMethod;

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
      const link = options?.paymentLink || '#';
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

  private generateCustomEmailHTML(inscricao: Inscricao, message: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Comunicado - Legacy Camp</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .message { background: #fff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 Comunicado</h1>
            <p>Legacy Camp</p>
          </div>
          <div class="content">
            <h2>Olá, ${inscricao.fullName}!</h2>
            
            <div class="message">
              ${message.replace(/\n/g, '<br>')}
            </div>

            <p>Atenciosamente,<br>Equipe Legacy Camp</p>
          </div>
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
        <meta charset="utf-8">
        <title>Contrato - Legacy Camp</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📄 Contrato - Legacy Camp</h1>
          </div>
          <div class="content">
            <h2>Olá, ${inscricao.fullName}!</h2>
            <p>Segue em anexo o contrato referente à sua inscrição no Legacy Camp.</p>
            <p>Por favor, revise o documento com atenção. Caso haja instruções de assinatura e devolução, siga-as conforme orientado pela equipe.</p>
            <p>Em caso de dúvidas, entre em contato:</p>
            <p>📞 +55 92 8409-5783<br/>✉ lgcymanaus@gmail.com</p>
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
