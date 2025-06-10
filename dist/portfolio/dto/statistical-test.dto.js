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
exports.StatisticalTestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const monte_carlo_simulation_result_dto_1 = require("./monte-carlo-simulation-result.dto");
class StatisticalTestDto {
}
exports.StatisticalTestDto = StatisticalTestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['modified_sharpe', 'min_cvar'],
        description: 'Daftar strategi yang ingin dibandingkan',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(['modified_sharpe', 'min_cvar'], { each: true }),
    __metadata("design:type", Array)
], StatisticalTestDto.prototype, "strategies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: monte_carlo_simulation_result_dto_1.MonteCarloSimulationResultDto,
        isArray: true,
        example: [
            {
                simulation_id: 0,
                strategy: 'modified_sharpe',
                mean_return: 0.0009411815444667043,
                volatility: 0.021531198857040044,
                sharpe_ratio: 0.02208726084783764,
                historical_cvar_95: 0.042611963110801336
            },
            {
                simulation_id: 0,
                strategy: 'min_cvar',
                mean_return: -0.000027447848121537074,
                volatility: 0.013267789481132625,
                sharpe_ratio: -0.0010020755638337076,
                historical_cvar_95: 0.027390996360122787
            }
        ],
        description: 'Hasil simulasi Monte Carlo sebagai input untuk uji statistik',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => monte_carlo_simulation_result_dto_1.MonteCarloSimulationResultDto),
    __metadata("design:type", Array)
], StatisticalTestDto.prototype, "monteCarloResults", void 0);
//# sourceMappingURL=statistical-test.dto.js.map