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
    return await this.sendEmail(
      inscricao,
      '📄 Contrato de Participação - Legacy Camp',
      this.generateContractEmailHTML(inscricao)
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
        `Subject: ${subject}`,
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
      return false;
    }
  }

  private generatePaymentInstructionEmailHTML(inscricao: Inscricao, options?: { paymentLink?: string }): string {
    const contractPath = path.join(process.cwd(), 'public', 'CONTRATO PARTICIPAÇÃO LEGACY CAMP MANAUS 25.pdf');
    const contractExists = fs.existsSync(contractPath);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Instruções de Pagamento - Legacy Camp</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .highlight { background: #e74c3c; color: white; padding: 10px; margin: 10px 0; }
          .info-box { background: #ecf0f1; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; }
          .footer { text-align: center; padding: 20px; color: #7f8c8d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏕️ Legacy Camp</h1>
            <h2>Instruções de Pagamento</h2>
          </div>
          
          <div class="content">
            <p>Olá <strong>${inscricao.fullName}</strong>!</p>
            
            <p>Obrigado por se inscrever no Legacy Camp! Sua inscrição foi recebida com sucesso.</p>
            
            <div class="highlight">
              <h3>📋 Dados da Inscrição</h3>
              <p><strong>Nome:</strong> ${inscricao.fullName}</p>
              <p><strong>Email:</strong> ${inscricao.email}</p>
              <p><strong>Telefone:</strong> ${inscricao.phone}</p>
              <p><strong>Status:</strong> ${inscricao.status}</p>
            </div>
            
            <div class="info-box">
              <h3>💳 Instruções de Pagamento</h3>
              <p>Para completar sua inscrição, realize o pagamento através dos métodos disponíveis:</p>
              <ul>
                <li><strong>PIX:</strong> Utilize o QR Code ou chave PIX fornecida</li>
                <li><strong>Transferência:</strong> Dados bancários serão enviados em breve</li>
                <li><strong>Cartão:</strong> Link de pagamento será disponibilizado</li>
              </ul>
              ${options?.paymentLink ? `<p><a href="${options.paymentLink}" style="background: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">💳 Realizar Pagamento</a></p>` : ''}
            </div>
            
            ${contractExists ? `
            <div class="info-box">
              <h3>📄 Contrato de Participação</h3>
              <p>Por favor, leia atentamente o contrato de participação anexo.</p>
            </div>
            ` : ''}
            
            <div class="info-box">
              <h3>📞 Suporte</h3>
              <p>Em caso de dúvidas, entre em contato conosco:</p>
              <p><strong>Email:</strong> contato@legacycamp.com</p>
              <p><strong>WhatsApp:</strong> (92) 99999-9999</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Legacy Camp - Transformando vidas através de experiências únicas</p>
            <p>Este é um email automático, por favor não responda.</p>
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
            
            <div class="info-box">
              <h3>📞 Suporte</h3>
              <p>Em caso de dúvidas sobre esta atualização, entre em contato conosco.</p>
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