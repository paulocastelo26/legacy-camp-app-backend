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
exports.InscricoesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inscricao_entity_1 = require("./entities/inscricao.entity");
let InscricoesService = class InscricoesService {
    constructor(inscricaoRepository) {
        this.inscricaoRepository = inscricaoRepository;
    }
    async create(createInscricaoDto) {
        const inscricao = this.inscricaoRepository.create({
            ...createInscricaoDto,
            birthDate: new Date(createInscricaoDto.birthDate),
        });
        return await this.inscricaoRepository.save(inscricao);
    }
    async findAll() {
        return await this.inscricaoRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const inscricao = await this.inscricaoRepository.findOne({ where: { id } });
        if (!inscricao) {
            throw new common_1.NotFoundException(`Inscrição com ID ${id} não encontrada`);
        }
        return inscricao;
    }
    async update(id, updateInscricaoDto) {
        const inscricao = await this.findOne(id);
        if (updateInscricaoDto.birthDate) {
            updateInscricaoDto.birthDate = new Date(updateInscricaoDto.birthDate).toISOString();
        }
        Object.assign(inscricao, updateInscricaoDto);
        return await this.inscricaoRepository.save(inscricao);
    }
    async remove(id) {
        const inscricao = await this.findOne(id);
        await this.inscricaoRepository.remove(inscricao);
    }
    async updateStatus(id, status) {
        const inscricao = await this.findOne(id);
        inscricao.status = status;
        return await this.inscricaoRepository.save(inscricao);
    }
    async findByStatus(status) {
        return await this.inscricaoRepository.find({
            where: { status },
            order: { createdAt: 'DESC' },
        });
    }
    async getStats() {
        const total = await this.inscricaoRepository.count();
        const pendentes = await this.inscricaoRepository.count({ where: { status: 'PENDENTE' } });
        const aprovadas = await this.inscricaoRepository.count({ where: { status: 'APROVADA' } });
        const rejeitadas = await this.inscricaoRepository.count({ where: { status: 'REJEITADA' } });
        return {
            total,
            pendentes,
            aprovadas,
            rejeitadas,
        };
    }
};
exports.InscricoesService = InscricoesService;
exports.InscricoesService = InscricoesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inscricao_entity_1.Inscricao)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InscricoesService);
//# sourceMappingURL=inscricoes.service.js.map