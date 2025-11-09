import { IsString, IsEmail, IsDateString, IsNumber, IsIn, IsBoolean, IsOptional, MinLength, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInscricaoDto {
  @ApiProperty({ description: 'Nome completo do inscrito' })
  @IsString()
  @MinLength(3)
  fullName: string;

  @ApiProperty({ description: 'Data de nascimento' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({ description: 'Idade calculada' })
  @IsNumber()
  @Min(12)
  @Max(100)
  age: number;

  @ApiProperty({ description: 'Gênero', enum: ['masculino', 'feminino'] })
  @IsIn(['masculino', 'feminino'])
  gender: string;

  @ApiProperty({ description: 'Telefone/WhatsApp' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'E-mail' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Endereço completo' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Redes sociais' })
  @IsString()
  socialMedia: string;

  // Contato de Emergência
  @ApiProperty({ description: 'Nome do contato de emergência' })
  @IsString()
  emergencyContactName: string;

  @ApiProperty({ description: 'Telefone do contato de emergência' })
  @IsString()
  emergencyContactPhone: string;

  @ApiProperty({ description: 'Grau de parentesco do contato de emergência' })
  @IsString()
  emergencyContactRelationship: string;

  // Informações de Igreja
  @ApiProperty({ description: 'É membro de Lagoinha', enum: ['sim', 'nao'] })
  @IsIn(['sim', 'nao'])
  isLagoinhaMember: string;

  @ApiProperty({ description: 'Nome da igreja' })
  @IsString()
  churchName: string;

  @ApiProperty({ description: 'Participação em ministérios' })
  @IsString()
  ministryParticipation: string;

  // Informações da Inscrição
  @ApiProperty({ description: 'Lote da inscrição', enum: ['lote1', 'lote2', 'lote3'] })
  @IsIn(['lote1', 'lote2'])
  registrationLot: string;

  @ApiProperty({ description: 'Forma de pagamento', enum: ['pix', 'cartao', 'carne'] })
  @IsIn(['pix', 'cartao', 'carne'])
  paymentMethod: string;

  @ApiProperty({ description: 'Comprovante de pagamento', required: false })
  @IsOptional()
  @IsString()
  paymentProof?: string;

  @ApiProperty({ description: 'Código do cupom de desconto', required: false, example: 'LGCYBV200' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  // Informações Adicionais
  @ApiProperty({ description: 'Tamanho da camisa', enum: ['PP','P', 'M', 'G', 'GG', 'XG'] })
  @IsIn(['PP','P', 'M', 'G', 'GG', 'XG'])
  shirtSize: string;

  @ApiProperty({ description: 'Possui alergia', enum: ['sim', 'nao'] })
  @IsIn(['sim', 'nao'])
  hasAllergy: string;

  @ApiProperty({ description: 'Detalhes da alergia', required: false })
  @IsOptional()
  @IsString()
  allergyDetails?: string;

  @ApiProperty({ description: 'Usa medicação', enum: ['sim', 'nao'], required: false })
  @IsOptional()
  @IsIn(['sim', 'nao'])
  usesMedication?: string;

  @ApiProperty({ description: 'Detalhes da medicação', required: false })
  @IsOptional()
  @IsString()
  medicationDetails?: string;

  @ApiProperty({ description: 'Restrição alimentar', enum: ['Nenhuma', 'Vegetariana', 'Intolerância à lactose', 'Intolerância ao glúten', 'Outras'] })
  @IsIn(['Nenhuma', 'Vegetariana', 'Intolerância à lactose', 'Intolerância ao glúten', 'Outras'])
  dietaryRestriction: string;

  // Enfoque e Cuidado
  @ApiProperty({ description: 'Fez teste ministerial', enum: ['sim', 'nao'] })
  @IsIn(['sim', 'nao'])
  hasMinistryTest: string;

  @ApiProperty({ description: 'Resultados do teste ministerial', required: false })
  @IsOptional()
  @IsString()
  ministryTestResults?: string;

  @ApiProperty({ description: 'Pedido de oração' })
  @IsString()
  prayerRequest: string;

  // Termos e Autorização
  @ApiProperty({ description: 'Autorização de uso de imagem' })
  @IsBoolean()
  imageAuthorization: boolean;

  @ApiProperty({ description: 'Ciência da análise' })
  @IsBoolean()
  analysisAwareness: boolean;

  @ApiProperty({ description: 'Ciência dos termos' })
  @IsBoolean()
  termsAwareness: boolean;

  @ApiProperty({ description: 'Declaração de verdade' })
  @IsBoolean()
  truthDeclaration: boolean;
} 