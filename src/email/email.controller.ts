import { Controller, Post, Body, Param, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { InscricoesService } from '../inscricoes/inscricoes.service';
import { 
  SendCustomEmailDto, 
  SendWelcomeEmailDto, 
  SendStatusUpdateEmailDto, 
  SendBulkEmailDto,
  SendPaymentInstructionEmailDto
} from './dto/send-email.dto';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly inscricoesService: InscricoesService,
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
}
