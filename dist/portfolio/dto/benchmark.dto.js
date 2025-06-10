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
exports.BenchmarkDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BenchmarkDto {
}
exports.BenchmarkDto = BenchmarkDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ["SMGR.JK", "PGAS.JK", "PTBA.JK", "ADRO.JK", "ITMG.JK", "INTP.JK", "INKP.JK", "INDF.JK", "INCO.JK", "ICBP.JK", "TLKM.JK", "EXCL.JK", "TOWR.JK", "UNTR.JK", "CPIN.JK", "UNVR.JK", "BMRI.JK", "BBTN.JK", "BBRI.JK", "BBNI.JK", "BBCA.JK", "ASII.JK", "ANTM.JK", "KLBF.JK", "MDKA.JK", "BRPT.JK", "TBIG.JK", "MEDC.JK", "ACES.JK", "GGRM.JK", "AKRA.JK", "JPFA.JK"],
        description: 'Daftar ticker saham dalam portofolio',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BenchmarkDto.prototype, "tickers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2019-09-01',
        description: 'Tanggal mulai analisis (format YYYY-MM-DD)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BenchmarkDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-09-01',
        description: 'Tanggal akhir analisis (format YYYY-MM-DD)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BenchmarkDto.prototype, "endDate", void 0);
//# sourceMappingURL=benchmark.dto.js.map