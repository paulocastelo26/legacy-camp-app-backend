"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInscricaoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateInscricaoDto {
}
exports.CreateInscricaoDto = CreateInscricaoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nome completo do inscrito' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data de nascimento' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Idade calculada' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(12),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateInscricaoDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gênero', enum: ['masculino', 'feminino'] }),
    (0, class_validator_1.IsIn)(['masculino', 'feminino']),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Telefone/WhatsApp' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'E-mail' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Endereço completo' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Redes sociais' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "socialMedia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nome do contato de emergência' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "emergencyContactName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Telefone do contato de emergência' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "emergencyContactPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Grau de parentesco do contato de emergência' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "emergencyContactRelationship", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'É membro de Lagoinha', enum: ['sim', 'nao'] }),
    (0, class_validator_1.IsIn)(['sim', 'nao']),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "isLagoinhaMember", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nome da igreja' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "churchName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Participação em ministérios' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "ministryParticipation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Lote da inscrição', enum: ['lote1', 'lote2'] }),
    (0, class_validator_1.IsIn)(['lote1', 'lote2']),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "registrationLot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Forma de pagamento', enum: ['pix', 'cartao', 'carne'] }),
    (0, class_validator_1.IsIn)(['pix', 'cartao', 'carne']),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Comprovante de pagamento', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "paymentProof", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tamanho da camisa', enum: ['P', 'M', 'G', 'GG', 'XG'] }),
    (0, class_validator_1.IsIn)(['P', 'M', 'G', 'GG', 'XG']),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "shirtSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Possui alergia', enum: ['sim', 'nao'] }),
    (0, class_validator_1.IsIn)(['sim', 'nao']),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "hasAllergy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detalhes da alergia', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "allergyDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Usa medicação', enum: ['sim', 'nao'], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['sim', 'nao']),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "usesMedication", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detalhes da medicação', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "medicationDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Restrição alimentar', enum: ['Nenhuma', 'Vegetariana', 'Intolerância à lactose', 'Intolerância ao glúten', 'Outras'] }),
    (0, class_validator_1.IsIn)(['Nenhuma', 'Vegetariana', 'Intolerância à lactose', 'Intolerância ao glúten', 'Outras']),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "dietaryRestriction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fez teste ministerial', enum: ['sim', 'nao'] }),
    (0, class_validator_1.IsIn)(['sim', 'nao']),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "hasMinistryTest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resultados do teste ministerial', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "ministryTestResults", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pedido de oração' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInscricaoDto.prototype, "prayerRequest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Autorização de uso de imagem' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInscricaoDto.prototype, "imageAuthorization", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ciência da análise' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInscricaoDto.prototype, "analysisAwareness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ciência dos termos' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInscricaoDto.prototype, "termsAwareness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Declaração de verdade' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInscricaoDto.prototype, "truthDeclaration", void 0);
//# sourceMappingURL=create-inscricao.dto.js.map