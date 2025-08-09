import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendCustomEmailDto {
  @ApiProperty({ description: 'ID da inscrição' })
  @IsNotEmpty()
  @IsString()
  inscricaoId: string;

  @ApiProperty({ description: 'Assunto do email' })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Mensagem do email' })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class SendWelcomeEmailDto {
  @ApiProperty({ description: 'ID da inscrição' })
  @IsNotEmpty()
  @IsString()
  inscricaoId: string;
}

export class SendStatusUpdateEmailDto {
  @ApiProperty({ description: 'ID da inscrição' })
  @IsNotEmpty()
  @IsString()
  inscricaoId: string;

  @ApiProperty({ description: 'Novo status da inscrição', enum: ['APROVADA', 'REPROVADA', 'PENDENTE', 'CANCELADA'] })
  @IsNotEmpty()
  @IsString()
  newStatus: string;
}

export class SendBulkEmailDto {
  @ApiProperty({ description: 'Lista de IDs das inscrições' })
  @IsNotEmpty()
  inscricaoIds: string[];

  @ApiProperty({ description: 'Assunto do email' })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Mensagem do email' })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class SendPaymentInstructionEmailDto {
  @ApiProperty({ description: 'ID da inscrição' })
  @IsNotEmpty()
  @IsString()
  inscricaoId: string;

}

export class SendContractEmailDto {
  @ApiProperty({ description: 'ID da inscrição' })
  @IsNotEmpty()
  @IsString()
  inscricaoId: string;

  @ApiProperty({ description: 'URL do PDF do contrato (opcional, se não usar env CONTRACT_PDF_URL/CONTRACT_PDF_PATH)', required: false })
  @IsOptional()
  @IsString()
  contractUrl?: string;

  @ApiProperty({ description: 'Caminho local do PDF do contrato (opcional)', required: false })
  @IsOptional()
  @IsString()
  contractPath?: string;

  @ApiProperty({ description: 'Nome do arquivo do contrato (opcional)', required: false })
  @IsOptional()
  @IsString()
  filename?: string;
}