import { Controller, Post, Body, Param, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { InscricoesService } from '../inscricoes/inscricoes.service';
import { 
  SendCustomEmailDto, 
  SendWelcomeEmailDto, 
  SendStatusUpdateEmailDto, 
  SendBulkEmailDto,
  SendPaymentInstructionEmailDto,
  SendContractEmailDto
} from './dto/send-email.dto';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly inscricoesService: InscricoesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('welcome')
  @ApiOperation({ summary: 'Enviar email de boas-vindas para um inscrito' })
  @ApiResponse({ status: 200, description: 'Email enviado com sucesso' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro ao enviar email' })
  async sendWelcomeEmail(@Body() sendWelcomeEmailDto: SendWelcomeEmailDto) {
    try {
      const inscricao = await this.inscricoesService.findOne(parseInt(sendWelcomeEmailDto.inscricaoId));
      
      if (!inscricao) {
        throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
      }

      const success = await this.emailService.sendWelcomeEmail(inscricao);
      
      if (success) {
        return {
          success: true,
          message: 'Email de boas-vindas enviado com sucesso',
          inscricao: {
            id: inscricao.id,
            fullName: inscricao.fullName,
            email: inscricao.email
          }
        };
      } else {
        throw new HttpException('Erro ao enviar email', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('status-update')
  @ApiOperation({ summary: 'Enviar email de atualização de status para um inscrito' })
  @ApiResponse({ status: 200, description: 'Email enviado com sucesso' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro ao enviar email' })
  async sendStatusUpdateEmail(@Body() sendStatusUpdateEmailDto: SendStatusUpdateEmailDto) {
    try {
      const inscricao = await this.inscricoesService.findOne(parseInt(sendStatusUpdateEmailDto.inscricaoId));
      
      if (!inscricao) {
        throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
      }

      const success = await this.emailService.sendStatusUpdateEmail(inscricao, sendStatusUpdateEmailDto.newStatus);
      
      if (success) {
        return {
          success: true,
          message: 'Email de atualização de status enviado com sucesso',
          inscricao: {
            id: inscricao.id,
            fullName: inscricao.fullName,
            email: inscricao.email,
            newStatus: sendStatusUpdateEmailDto.newStatus
          }
        };
      } else {
        throw new HttpException('Erro ao enviar email', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('custom')
  @ApiOperation({ summary: 'Enviar email personalizado para um inscrito' })
  @ApiResponse({ status: 200, description: 'Email enviado com sucesso' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro ao enviar email' })
  async sendCustomEmail(@Body() sendCustomEmailDto: SendCustomEmailDto) {
    try {
      const inscricao = await this.inscricoesService.findOne(parseInt(sendCustomEmailDto.inscricaoId));
      
      if (!inscricao) {
        throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
      }

      const success = await this.emailService.sendCustomEmail(
        inscricao, 
        sendCustomEmailDto.subject, 
        sendCustomEmailDto.message
      );
      
      if (success) {
        return {
          success: true,
          message: 'Email personalizado enviado com sucesso',
          inscricao: {
            id: inscricao.id,
            fullName: inscricao.fullName,
            email: inscricao.email
          },
          email: {
            subject: sendCustomEmailDto.subject,
            message: sendCustomEmailDto.message
          }
        };
      } else {
        throw new HttpException('Erro ao enviar email', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Enviar email personalizado para múltiplos inscritos' })
  @ApiResponse({ status: 200, description: 'Emails enviados com sucesso' })
  @ApiResponse({ status: 404, description: 'Uma ou mais inscrições não encontradas' })
  @ApiResponse({ status: 500, description: 'Erro ao enviar emails' })
  async sendBulkEmail(@Body() sendBulkEmailDto: SendBulkEmailDto) {
    try {
      const results = [];
      const errors = [];

      for (const inscricaoId of sendBulkEmailDto.inscricaoIds) {
        try {
          const inscricao = await this.inscricoesService.findOne(parseInt(inscricaoId));
          
          if (!inscricao) {
            errors.push({
              inscricaoId,
              error: 'Inscrição não encontrada'
            });
            continue;
          }

          const success = await this.emailService.sendCustomEmail(
            inscricao, 
            sendBulkEmailDto.subject, 
            sendBulkEmailDto.message
          );

          if (success) {
            results.push({
              inscricaoId,
              fullName: inscricao.fullName,
              email: inscricao.email,
              status: 'enviado'
            });
          } else {
            errors.push({
              inscricaoId,
              fullName: inscricao.fullName,
              email: inscricao.email,
              error: 'Erro ao enviar email'
            });
          }
        } catch (error) {
          errors.push({
            inscricaoId,
            error: error.message
          });
        }
      }

      return {
        success: true,
        message: `Processamento concluído. ${results.length} emails enviados, ${errors.length} erros.`,
        results,
        errors,
        summary: {
          total: sendBulkEmailDto.inscricaoIds.length,
          sent: results.length,
          failed: errors.length
        }
      };
    } catch (error) {
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('payment-instructions')
  @ApiOperation({ summary: 'Enviar email de instruções de pagamento de acordo com a forma escolhida' })
  @ApiResponse({ status: 200, description: 'Email enviado com sucesso' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro ao enviar email' })
  async sendPaymentInstructions(@Body() dto: SendPaymentInstructionEmailDto) {
    try {
      const inscricao = await this.inscricoesService.findOne(parseInt(dto.inscricaoId));

      if (!inscricao) {
        throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
      }

      const success = await this.emailService.sendPaymentInstructionEmail(inscricao, { paymentLink: inscricao.registrationLot === 'lote1' ? "https://mpago.la/1KX5CeV" : "https://mpago.la/22L9ag7" });

      if (success) {
        return {
          success: true,
          message: 'Email de instruções de pagamento enviado com sucesso',
          inscricao: {
            id: inscricao.id,
            fullName: inscricao.fullName,
            email: inscricao.email,
            paymentMethod: inscricao.paymentMethod,
          },
        };
      } else {
        throw new HttpException('Erro ao enviar email', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('contract')
  @ApiOperation({ summary: 'Enviar contrato em PDF por email para um inscrito' })
  @ApiResponse({ status: 200, description: 'Contrato enviado com sucesso' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro ao enviar contrato' })
  async sendContract(@Body() dto: SendContractEmailDto) {
    try {
      const inscricao = await this.inscricoesService.findOne(parseInt(dto.inscricaoId));

      if (!inscricao) {
        throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
      }

      const success = await this.emailService.sendContractEmail(inscricao, {
        contractUrl: dto.contractUrl,
        contractPath: dto.contractPath,
        filename: dto.filename,
      });

      if (success) {
        return {
          success: true,
          message: 'Contrato enviado com sucesso',
          inscricao: {
            id: inscricao.id,
            fullName: inscricao.fullName,
            email: inscricao.email,
          },
        };
      } else {
        throw new HttpException('Erro ao enviar contrato', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('test/:inscricaoId')
  @ApiOperation({ summary: 'Testar envio de email para um inscrito (email de boas-vindas)' })
  @ApiParam({ name: 'inscricaoId', description: 'ID da inscrição' })
  @ApiResponse({ status: 200, description: 'Email de teste enviado com sucesso' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  async testEmail(@Param('inscricaoId') inscricaoId: string) {
    try {
      const inscricao = await this.inscricoesService.findOne(parseInt(inscricaoId));
      
      if (!inscricao) {
        throw new HttpException('Inscrição não encontrada', HttpStatus.NOT_FOUND);
      }

      const success = await this.emailService.sendWelcomeEmail(inscricao);
      
      if (success) {
        return {
          success: true,
          message: 'Email de teste enviado com sucesso',
          inscricao: {
            id: inscricao.id,
            fullName: inscricao.fullName,
            email: inscricao.email
          }
        };
      } else {
        throw new HttpException('Erro ao enviar email de teste', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

      @Get('config')
      @ApiOperation({ summary: 'Verificar configuração das variáveis de ambiente de email' })
      @ApiResponse({ status: 200, description: 'Status das configurações de email' })
      async checkEmailConfig() {
        const web3FormsAccessKey = this.configService.get<string>('WEB3FORMS_ACCESS_KEY');
        const nodeEnv = this.configService.get<string>('NODE_ENV');
        const railwayEnv = process.env.RAILWAY_ENVIRONMENT;

        const isRailway = nodeEnv === 'production' || railwayEnv;
        const hasWeb3FormsKey = !!web3FormsAccessKey;
        const willUseWeb3Forms = isRailway && hasWeb3FormsKey;

        return {
          success: true,
          message: 'Status das configurações de email',
          config: {
            environment: {
              nodeEnv: nodeEnv || 'NÃO CONFIGURADO',
              railwayEnv: railwayEnv || 'NÃO DETECTADO',
              status: isRailway ? '🚂 Railway/Produção' : '💻 Desenvolvimento'
            },
            web3FormsConfig: {
              accessKey: {
                configured: !!web3FormsAccessKey,
                status: web3FormsAccessKey ? '✅ Configurado' : '❌ NÃO CONFIGURADO'
              }
            },
            emailService: {
              willUse: willUseWeb3Forms ? '🚀 Web3Forms (100% GRATUITO)' : '📧 SMTP',
              fromEmail: willUseWeb3Forms ? 'Legacy Camp via Web3Forms' : 'EMAIL_USER configurado'
            }
          },
          recommendations: {
            issues: [
              ...(isRailway && !hasWeb3FormsKey ? ['Configure WEB3FORMS_ACCESS_KEY no Railway Dashboard'] : [])
            ],
            nextSteps: [
              'Teste o envio de email com /email/test/1',
              'Monitore os logs em tempo real no Railway Dashboard'
            ],
            railwayInfo: {
              message: isRailway && !hasWeb3FormsKey ? 'Railway bloqueia SMTP. Configure Web3Forms (GRATUITO).' : 'Configuração adequada.'
            },
            web3FormsInfo: {
              message: 'Web3Forms é 100% GRATUITO - sem limites de emails!',
              setup: '1. Acesse web3forms.com 2. Crie conta gratuita 3. Copie Access Key 4. Configure no Railway'
            }
          }
        };
      }

}
