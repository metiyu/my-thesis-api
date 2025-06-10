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
exports.EfficientFrontierDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class EfficientFrontierDto {
}
exports.EfficientFrontierDto = EfficientFrontierDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['BBCA.JK', 'BMRI.JK', 'ITMG.JK', 'MDKA.JK', 'ADRO.JK', 'AKRA.JK', 'TBIG.JK'],
        description: 'Daftar ticker saham yang akan digunakan untuk generate efficient frontier',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ArrayMinSize)(1),
    __metadata("design:type", Array)
], EfficientFrontierDto.prototype, "tickers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2020-01-01',
        description: 'Tanggal mulai analisis (format YYYY-MM-DD)',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], EfficientFrontierDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-01-01',
        description: 'Tanggal akhir analisis (format YYYY-MM-DD)',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], EfficientFrontierDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100,
        minimum: 10,
        maximum: 1000,
        description: 'Jumlah titik pada efficient frontier',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EfficientFrontierDto.prototype, "n_points", void 0);
//# sourceMappingURL=efficient-frontier.dto.js.map