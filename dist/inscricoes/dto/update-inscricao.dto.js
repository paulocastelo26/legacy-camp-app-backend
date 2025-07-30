"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInscricaoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_inscricao_dto_1 = require("./create-inscricao.dto");
class UpdateInscricaoDto extends (0, swagger_1.PartialType)(create_inscricao_dto_1.CreateInscricaoDto) {
}
exports.UpdateInscricaoDto = UpdateInscricaoDto;
//# sourceMappingURL=update-inscricao.dto.js.map