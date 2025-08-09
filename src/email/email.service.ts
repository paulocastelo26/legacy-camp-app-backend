import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Inscricao } from '../inscricoes/entities/inscricao.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  async sendPaymentInstructionEmail(
    inscricao: Inscricao,
    options?: { paymentLink?: string }
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Legacy Camp" <${this.configService.get<string>('EMAIL_USER')}>`,
        to: inscricao.email,
        subject: '📌 Instruções de pagamento - Legacy Camp',
        html: this.generatePaymentInstructionEmailHTML(inscricao, options),
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email de instruções de pagamento enviado para ${inscricao.email}`);
      return true;
    } catch (error) {
      this.logger.error(`Erro ao enviar email de instruções de pagamento: ${error.message}`);
      return false;
    }
  }

  private initializeTransporter() {
    // Configuração para Gmail (recomendado para testes)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'), // Use App Password para Gmail
      },
    });

    // Configuração alternativa para outros provedores
    // this.transporter = nodemailer.createTransport({
    //   host: this.configService.get<string>('EMAIL_HOST'),
    //   port: this.configService.get<number>('EMAIL_PORT'),
    //   secure: true, // true para 465, false para outras portas
    //   auth: {
    //     user: this.configService.get<string>('EMAIL_USER'),
    //     pass: this.configService.get<string>('EMAIL_PASSWORD'),
    //   },
    // });
  }

  async sendWelcomeEmail(inscricao: Inscricao): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Legacy Camp" <${this.configService.get<string>('EMAIL_USER')}>`,
        to: inscricao.email,
        subject: '🎉 Bem-vindo ao Legacy Camp!',
        html: this.generateWelcomeEmailHTML(inscricao),
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email de boas-vindas enviado para ${inscricao.email}`);
      return true;
    } catch (error) {
      this.logger.error(`Erro ao enviar email de boas-vindas: ${error.message}`);
      return false;
    }
  }

  async sendStatusUpdateEmail(inscricao: Inscricao, newStatus: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Legacy Camp" <${this.configService.get<string>('EMAIL_USER')}>`,
        to: inscricao.email,
        subject: `📋 Atualização de Status - Legacy Camp`,
        html: this.generateStatusUpdateEmailHTML(inscricao, newStatus),
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email de atualização de status enviado para ${inscricao.email}`);
      return true;
    } catch (error) {
      this.logger.error(`Erro ao enviar email de atualização: ${error.message}`);
      return false;
    }
  }

  async sendCustomEmail(inscricao: Inscricao, subject: string, message: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Legacy Camp" <${this.configService.get<string>('EMAIL_USER')}>`,
        to: inscricao.email,
        subject: subject,
        html: this.generateCustomEmailHTML(inscricao, message),
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email personalizado enviado para ${inscricao.email}`);
      return true;
    } catch (error) {
      this.logger.error(`Erro ao enviar email personalizado: ${error.message}`);
      return false;
    }
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
}
