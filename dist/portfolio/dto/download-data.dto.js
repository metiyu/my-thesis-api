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
exports.DownloadDataDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DownloadDataDto {
}
exports.DownloadDataDto = DownloadDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['BBCA.JK', 'BBRI.JK'],
        description: 'Daftar ticker saham yang ingin diunduh datanya',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ArrayMinSize)(1),
    __metadata("design:type", Array)
], DownloadDataDto.prototype, "tickers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2020-01-01',
        description: 'Tanggal awal pengambilan data (format YYYY-MM-DD)',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DownloadDataDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-01-01',
        description: 'Tanggal akhir pengambilan data (format YYYY-MM-DD)',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DownloadDataDto.prototype, "endDate", void 0);
//# sourceMappingURL=download-data.dto.js.map