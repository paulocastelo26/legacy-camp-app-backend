"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InscricoesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const inscricoes_service_1 = require("./inscricoes.service");
const inscricoes_controller_1 = require("./inscricoes.controller");
const inscricao_entity_1 = require("./entities/inscricao.entity");
let InscricoesModule = class InscricoesModule {
};
exports.InscricoesModule = InscricoesModule;
exports.InscricoesModule = InscricoesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([inscricao_entity_1.Inscricao])],
        controllers: [inscricoes_controller_1.InscricoesController],
        providers: [inscricoes_service_1.InscricoesService],
        exports: [inscricoes_service_1.InscricoesService],
    })
], InscricoesModule);
//# sourceMappingURL=inscricoes.module.js.map