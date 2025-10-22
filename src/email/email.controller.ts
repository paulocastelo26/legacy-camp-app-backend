import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { InscricoesService } from '../inscricoes/inscricoes.service';
import { ConfigService } from '@nestjs/config';
import { SendCustomEmailDto } from './dto/send-email.dto';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly inscricoesService: InscricoesService,
    private readonly configService: ConfigService
  ) {}

  @Get('test/:id')
  @ApiOperation({ summary: 'Testar envio de email para uma inscrição específica' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({ status: 200, description: 'Email de teste enviado com sucesso' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  async testEmail(@Param('id') id: string) {
    try {
      const inscricao = await this.inscricoesService.findOne(+id);
      if (!inscricao) {
        throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
      }

      const success = await this.emailService.sendWelcomeEmail(inscricao);
      
      if (success) {
        return {
          success: true,
          message: `Email de teste enviado com sucesso para ${inscricao.email}`,
          inscricao: {
            id: inscricao.id,
            fullName: inscricao.fullName,
            email: inscricao.email,
            status: inscricao.status
          }
        };
      } else {
        throw new HttpException('Falha ao enviar email', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('send-contract/:id')
  @ApiOperation({ summary: 'Enviar contrato de participação para uma inscrição' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({ status: 200, description: 'Contrato enviado com sucesso' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  async sendContract(@Param('id') id: string) {
    try {
      const inscricao = await this.inscricoesService.findOne(+id);
      if (!inscricao) {
        throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
      }

      const success = await this.emailService.sendContractEmail(inscricao);
      
      if (success) {
        return {
          success: true,
          message: `Contrato enviado com sucesso para ${inscricao.email}`,
          inscricao: {
            id: inscricao.id,
            fullName: inscricao.fullName,
            email: inscricao.email,
            status: inscricao.status
          }
        };
      } else {
        throw new HttpException('Falha ao enviar contrato', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('send')
  @ApiOperation({ summary: 'Enviar email personalizado para uma inscrição' })
  @ApiResponse({ status: 200, description: 'Email enviado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  async sendCustomEmail(@Body() sendEmailDto: SendCustomEmailDto) {
    try {
      const inscricao = await this.inscricoesService.findOne(+sendEmailDto.inscricaoId);
      if (!inscricao) {
        throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
      }

      const success = await this.emailService.sendCustomEmail(
        inscricao,
        sendEmailDto.subject,
        sendEmailDto.message
      );
      
      if (success) {
        return {
          success: true,
          message: `Email enviado com sucesso para ${inscricao.email}`,
          inscricao: {
            id: inscricao.id,
            fullName: inscricao.fullName,
            email: inscricao.email
          }
        };
      } else {
        throw new HttpException('Falha ao enviar email', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('send-payment-instructions/:id')
  @ApiOperation({ summary: 'Enviar instruções de pagamento para uma inscrição' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({ status: 200, description: 'Instruções de pagamento enviadas com sucesso' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  async sendPaymentInstructions(@Param('id') id: string) {
    try {
      const inscricao = await this.inscricoesService.findOne(+id);
      if (!inscricao) {
        throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
      }

      const success = await this.emailService.sendPaymentInstructionEmail(inscricao);
      
      if (success) {
        return {
          success: true,
          message: `Instruções de pagamento enviadas com sucesso para ${inscricao.email}`,
          inscricao: {
            id: inscricao.id,
            fullName: inscricao.fullName,
            email: inscricao.email,
            status: inscricao.status
          }
        };
      } else {
        throw new HttpException('Falha ao enviar instruções de pagamento', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('send-welcome/:id')
  @ApiOperation({ summary: 'Enviar email de boas-vindas para uma inscrição' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({ status: 200, description: 'Email de boas-vindas enviado com sucesso' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  async sendWelcome(@Param('id') id: string) {
    try {
      const inscricao = await this.inscricoesService.findOne(+id);
      if (!inscricao) {
        throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
      }

      const success = await this.emailService.sendWelcomeEmail(inscricao);
      
      if (success) {
        return {
          success: true,
          message: `Email de boas-vindas enviado com sucesso para ${inscricao.email}`,
          inscricao: {
            id: inscricao.id,
            fullName: inscricao.fullName,
            email: inscricao.email,
            status: inscricao.status
          }
        };
      } else {
        throw new HttpException('Falha ao enviar email de boas-vindas', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('auth-url')
  @ApiOperation({ summary: 'Gerar URL de autorização para obter refresh token' })
  @ApiResponse({ status: 200, description: 'URL de autorização gerada' })
  async generateAuthUrl() {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const googleClientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

    if (!googleClientId || !googleClientSecret) {
      throw new HttpException('GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET devem estar configurados', HttpStatus.BAD_REQUEST);
    }

    const { google } = require('googleapis');
    
    const oauth2Client = new google.auth.OAuth2(
      googleClientId,
      googleClientSecret,
      'http://localhost:3000/oauth/callback' // Redirect URI para desenvolvimento
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.send'],
      prompt: 'consent' // Força a tela de consentimento para obter refresh token
    });

    return {
      success: true,
      message: 'URL de autorização gerada com sucesso',
      authUrl: authUrl,
      instructions: [
        '1. Configure o redirect URI no Google Console: http://localhost:3000/oauth/callback',
        '2. Acesse a URL acima no seu navegador',
        '3. Faça login com sua conta Google',
        '4. Autorize o aplicativo',
        '5. Copie o código de autorização que aparece na tela',
        '6. Use o endpoint /email/exchange-code com esse código'
      ]
    };
  }

  @Get('exchange-code/:code')
  @ApiOperation({ summary: 'Trocar código de autorização por refresh token' })
  @ApiParam({ name: 'code', description: 'Código de autorização recebido do Google' })
  @ApiResponse({ status: 200, description: 'Refresh token gerado com sucesso' })
  async exchangeCodeForToken(@Param('code') code: string) {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const googleClientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

    if (!googleClientId || !googleClientSecret) {
      throw new HttpException('GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET devem estar configurados', HttpStatus.BAD_REQUEST);
    }

    try {
      const { google } = require('googleapis');
      
      const oauth2Client = new google.auth.OAuth2(
        googleClientId,
        googleClientSecret,
        'http://localhost:3000/oauth/callback'
      );

      const { tokens } = await oauth2Client.getToken(code);
      
      return {
        success: true,
        message: 'Tokens gerados com sucesso!',
        tokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          scope: tokens.scope,
          token_type: tokens.token_type,
          expiry_date: tokens.expiry_date
        },
        nextSteps: [
          '1. Copie o refresh_token acima',
          '2. Configure GOOGLE_REFRESH_TOKEN no Railway Dashboard',
          '3. Configure EMAIL_USER com seu email Gmail',
          '4. Teste o envio com /email/test/1'
        ]
      };
    } catch (error) {
      throw new HttpException(`Erro ao trocar código por token: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('config')
  @ApiOperation({ summary: 'Verificar configuração da Gmail API' })
  @ApiResponse({ status: 200, description: 'Status das configurações de email' })
  async checkEmailConfig() {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const googleClientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const googleRefreshToken = this.configService.get<string>('GOOGLE_REFRESH_TOKEN');
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const railwayEnv = process.env.RAILWAY_ENVIRONMENT;

    const isRailway = nodeEnv === 'production' || railwayEnv;
    const hasGoogleConfig = !!(googleClientId && googleClientSecret && googleRefreshToken);

    return {
      success: true,
      message: 'Status das configurações de email',
      config: {
        environment: {
          nodeEnv: nodeEnv || 'NÃO CONFIGURADO',
          railwayEnv: railwayEnv || 'NÃO DETECTADO',
          status: isRailway ? '🚂 Railway/Produção' : '💻 Desenvolvimento'
        },
        gmailApiConfig: {
          clientId: {
            configured: !!googleClientId,
            status: googleClientId ? `✅ ${googleClientId.substring(0, 20)}...` : '❌ NÃO CONFIGURADO'
          },
          clientSecret: {
            configured: !!googleClientSecret,
            status: googleClientSecret ? '✅ Configurado' : '❌ NÃO CONFIGURADO'
          },
          refreshToken: {
            configured: !!googleRefreshToken,
            status: googleRefreshToken ? '✅ Configurado' : '❌ NÃO CONFIGURADO'
          },
          emailUser: {
            configured: !!emailUser,
            status: emailUser ? `✅ ${emailUser}` : '❌ NÃO CONFIGURADO'
          }
        },
        emailService: {
          willUse: '🚀 Gmail API (100% GRATUITO)',
          fromEmail: emailUser || 'EMAIL_USER não configurado',
          environment: 'Local + Railway'
        }
      },
      recommendations: {
        issues: [
          ...(!hasGoogleConfig ? ['Configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e GOOGLE_REFRESH_TOKEN'] : []),
          ...(!emailUser ? ['Configure EMAIL_USER'] : [])
        ],
        nextSteps: [
          'Teste o envio de email com /email/test/1',
          ...(isRailway ? ['Monitore os logs em tempo real no Railway Dashboard'] : ['Monitore os logs no terminal local'])
        ],
        environmentInfo: {
          message: 'Gmail API funciona tanto local quanto no Railway!'
        },
        gmailApiSetup: {
          message: 'Gmail API é 100% GRATUITO - sem limites de envio!',
          steps: [
            '1. Acesse console.developers.google.com',
            '2. Crie um novo projeto ou selecione um existente',
            '3. Ative a Gmail API',
            '4. Crie credenciais OAuth 2.0',
            '5. Configure redirect URI: http://localhost:3000/oauth/callback',
            '6. Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET',
            '7. Use /email/auth-url para gerar URL de autorização',
            '8. Use /email/exchange-code/:code para obter refresh token',
            '9. Configure GOOGLE_REFRESH_TOKEN e EMAIL_USER'
          ],
          automatedSteps: [
            '✅ Use /email/auth-url para gerar URL de autorização',
            '✅ Use /email/exchange-code/:code para obter refresh token',
            '✅ Configure as variáveis no Railway Dashboard',
            '✅ Teste com /email/test/1'
          ]
        }
      }
    };
  }
}