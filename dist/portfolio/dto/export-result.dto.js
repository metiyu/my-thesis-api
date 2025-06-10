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
exports.ExportResultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ExportResultDto {
}
exports.ExportResultDto = ExportResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'csv',
        enum: ['csv', 'xlsx'],
        description: 'Format file ekspor (csv atau xlsx)',
    }),
    __metadata("design:type", String)
], ExportResultDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            returns_data: {
                BBCA: [0.01, -0.005, 0.003],
                BMRI: [0.015, -0.002, 0.007],
            },
            stock_metrics: {
                BBCA: {
                    mean_return: 0.0012,
                    volatility: 0.016,
                    sharpe_ratio: 0.0358,
                },
            },
            portfolio_results: {
                modified_sharpe: {
                    weights: { BBCA: 0.25, BMRI: 0.3, ITMG: 0.15 },
                    metrics: { mean_return: 0.0012, volatility: 0.016 }
                }
            }
        },
        description: 'Data mentah yang akan diekspor',
    }),
    __metadata("design:type", Object)
], ExportResultDto.prototype, "data", void 0);
//# sourceMappingURL=export-result.dto.js.map