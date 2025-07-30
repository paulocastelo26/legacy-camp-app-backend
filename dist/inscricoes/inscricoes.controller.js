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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InscricoesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inscricoes_service_1 = require("./inscricoes.service");
const create_inscricao_dto_1 = require("./dto/create-inscricao.dto");
const update_inscricao_dto_1 = require("./dto/update-inscricao.dto");
const inscricao_entity_1 = require("./entities/inscricao.entity");
let InscricoesController = class InscricoesController {
    constructor(inscricoesService) {
        this.inscricoesService = inscricoesService;
    }
    async create(createInscricaoDto) {
        return await this.inscricoesService.create(createInscricaoDto);
    }
    async findAll() {
        return await this.inscricoesService.findAll();
    }
    async getStats() {
        return await this.inscricoesService.getStats();
    }
    async findByStatus(status) {
        return await this.inscricoesService.findByStatus(status);
    }
    async findOne(id) {
        return await this.inscricoesService.findOne(+id);
    }
    async update(id, updateInscricaoDto) {
        return await this.inscricoesService.update(+id, updateInscricaoDto);
    }
    async updateStatus(id, status) {
        return await this.inscricoesService.updateStatus(+id, status);
    }
    async remove(id) {
        return await this.inscricoesService.remove(+id);
    }
};
exports.InscricoesController = InscricoesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova inscrição' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Inscrição criada com sucesso', type: inscricao_entity_1.Inscricao }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inscricao_dto_1.CreateInscricaoDto]),
    __metadata("design:returntype", Promise)
], InscricoesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as inscrições' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de inscrições', type: [inscricao_entity_1.Inscricao] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InscricoesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas das inscrições' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estatísticas das inscrições' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InscricoesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar inscrições por status' }),
    (0, swagger_1.ApiParam)({ name: 'status', description: 'Status das inscrições' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de inscrições por status', type: [inscricao_entity_1.Inscricao] }),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InscricoesController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar inscrição por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da inscrição' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inscrição encontrada', type: inscricao_entity_1.Inscricao }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inscrição não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InscricoesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar inscrição' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da inscrição' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inscrição atualizada com sucesso', type: inscricao_entity_1.Inscricao }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inscrição não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inscricao_dto_1.UpdateInscricaoDto]),
    __metadata("design:returntype", Promise)
], InscricoesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar status da inscrição' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da inscrição' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status atualizado com sucesso', type: inscricao_entity_1.Inscricao }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inscrição não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InscricoesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remover inscrição' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da inscrição' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Inscrição removida com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inscrição não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InscricoesController.prototype, "remove", null);
exports.InscricoesController = InscricoesController = __decorate([
    (0, swagger_1.ApiTags)('inscricoes'),
    (0, common_1.Controller)('inscricoes'),
    __metadata("design:paramtypes", [inscricoes_service_1.InscricoesService])
], InscricoesController);
//# sourceMappingURL=inscricoes.controller.js.map