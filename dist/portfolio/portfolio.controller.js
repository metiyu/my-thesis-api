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
exports.PortfolioController = void 0;
const common_1 = require("@nestjs/common");
const portfolio_service_1 = require("./portfolio.service");
const download_data_dto_1 = require("./dto/download-data.dto");
const swagger_1 = require("@nestjs/swagger");
const individual_stock_dto_1 = require("./dto/individual-stock.dto");
const optimize_portfolio_dto_1 = require("./dto/optimize-portfolio.dto");
const efficient_frontier_dto_1 = require("./dto/efficient-frontier.dto");
const monte_carlo_dto_1 = require("./dto/monte-carlo.dto");
const statistical_test_dto_1 = require("./dto/statistical-test.dto");
const extreme_case_dto_1 = require("./dto/extreme-case.dto");
const benchmark_dto_1 = require("./dto/benchmark.dto");
const throttler_1 = require("@nestjs/throttler");
let PortfolioController = class PortfolioController {
    constructor(portfolioService) {
        this.portfolioService = portfolioService;
    }
    async downloadHistoricalData(dto) {
        return await this.portfolioService.downloadData(dto);
    }
    async analyzeIndividualStocks(dto) {
        return await this.portfolioService.analyzeIndividualStocks(dto);
    }
    async optimizePortfolio(dto) {
        return await this.portfolioService.optimizePortfolio(dto);
    }
    async generateEfficientFrontier(dto) {
        return await this.portfolioService.generateEfficientFrontier(dto);
    }
    async monteCarloSimulation(dto) {
        return await this.portfolioService.monteCarloSimulation(dto);
    }
    async performStatisticalTest(dto) {
        return await this.portfolioService.performStatisticalTest(dto);
    }
    async analyzeExtremeCases(dto) {
        return await this.portfolioService.analyzeExtremeCases(dto);
    }
    async compareWithBenchmark(dto) {
        return await this.portfolioService.compareWithBenchmark(dto);
    }
};
exports.PortfolioController = PortfolioController;
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Post)('download'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Download data historis saham' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Berhasil mengunduh data saham',
        schema: {
            example: {
                returns: {
                    'BBCA.JK': [0.01, -0.005, 0.003],
                    'BMRI.JK': [0.015, -0.002, 0.007],
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [download_data_dto_1.DownloadDataDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "downloadHistoricalData", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Post)('analyze-individual'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Analisis statistik individu tiap saham' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Berhasil melakukan analisis saham individu',
        schema: {
            example: {
                analysis: {
                    'BBCA.JK': {
                        mean_return: 0.0012,
                        volatility: 0.016,
                        sharpe_ratio: 0.0358,
                        skewness: 0.12,
                        kurtosis: 4.15,
                    },
                    'BBRI.JK': {
                        mean_return: 0.0011,
                        volatility: 0.017,
                        sharpe_ratio: 0.0324,
                        skewness: 0.18,
                        kurtosis: 4.29,
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [individual_stock_dto_1.IndividualStockAnalysisDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "analyzeIndividualStocks", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Post)('optimize'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Optimasi portofolio menggunakan strategi tertentu' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Berhasil melakukan optimasi portofolio',
        schema: {
            example: {
                optimized_weights: {
                    'BBCA.JK': 0.25,
                    'BMRI.JK': 0.3,
                    'ITMG.JK': 0.15,
                    'MDKA.JK': 0.1,
                    'ADRO.JK': 0.1,
                    'AKRA.JK': 0.05,
                    'TBIG.JK': 0.05,
                },
                metrics: {
                    mean_return: 0.0012,
                    volatility: 0.016,
                    sharpe_ratio: 0.0358,
                    cvar_95: 0.0339,
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [optimize_portfolio_dto_1.OptimizePortfolioDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "optimizePortfolio", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Post)('frontier'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Generate efficient frontier berdasarkan variasi target return' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Berhasil menghasilkan titik-titik efisien di efficient frontier',
        schema: {
            example: {
                frontier_points: [
                    {
                        risk: 0.0237,
                        return: 0.00036,
                    },
                    {
                        risk: 0.0241,
                        return: 0.0005,
                    },
                    {
                        risk: 0.0265,
                        return: 0.00075,
                    },
                    {
                        risk: 0.0339,
                        return: 0.00122,
                    }
                ],
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [efficient_frontier_dto_1.EfficientFrontierDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "generateEfficientFrontier", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Post)('monte-carlo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Lakukan simulasi Monte Carlo untuk membandingkan strategi optimasi' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Berhasil menjalankan simulasi Monte Carlo',
        schema: {
            example: {
                simulation_results: [
                    {
                        simulation_id: 1,
                        strategy: "modified_sharpe",
                        mean_return: 0.0012,
                        volatility: 0.016,
                        sharpe_ratio: 0.0358,
                        historical_cvar_95: 0.0339,
                    },
                    {
                        simulation_id: 1,
                        strategy: "min_cvar",
                        mean_return: 0.0005,
                        volatility: 0.011,
                        sharpe_ratio: 0.032,
                        historical_cvar_95: 0.021,
                    }
                ],
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [monte_carlo_dto_1.MonteCarloSimulationDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "monteCarloSimulation", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Post)('stat-test'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Lakukan uji statistik antar strategi optimasi portofolio' }),
    (0, swagger_1.ApiBody)({ type: statistical_test_dto_1.StatisticalTestDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Berhasil menjalankan simulasi Monte Carlo',
        schema: {
            example: {
                statistical_tests: [],
                summary: {
                    total_comparisons: 0,
                    significant_comparisons: 0,
                    strategies_tested: [
                        "modified_sharpe",
                        "min_cvar",
                        "mean_cvar"
                    ],
                    metrics_tested: [
                        "mean_return",
                        "sharpe_ratio",
                        "volatility",
                        "historical_cvar_95"
                    ],
                    total_simulations: 3
                }
            }
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [statistical_test_dto_1.StatisticalTestDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "performStatisticalTest", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Post)('extreme-cases'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Analisis kasus ekstrem dari hasil simulasi Monte Carlo' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Berhasil menganalisis kasus ekstrem',
        schema: {
            example: {
                extreme_cases: {
                    modified_sharpe: {
                        best_case: {
                            mean_return: 0.0009411815444667043,
                            volatility: 0.021531198857040044,
                            sharpe_ratio: 0.02208726084783764
                        },
                        worst_case: {
                            mean_return: 0.0009411815444667043,
                            volatility: 0.021531198857040044,
                            sharpe_ratio: 0.02208726084783764
                        }
                    },
                    min_cvar: {
                        best_case: {
                            mean_return: -0.000027447848121537074,
                            volatility: 0.013267789481132625,
                            sharpe_ratio: -0.0010020755638337076
                        },
                        worst_case: {
                            mean_return: -0.000027447848121537074,
                            volatility: 0.013267789481132625,
                            sharpe_ratio: -0.0010020755638337076
                        }
                    }
                }
            }
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [extreme_case_dto_1.ExtremeCaseAnalysisDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "analyzeExtremeCases", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Get)('benchmark'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Bandingkan kinerja portofolio terhadap portofolio benchmark' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Berhasil membandingkan performa portofolio',
        schema: {
            example: {
                benchmark_performance: {
                    mean_return: 0.0004779275253219952,
                    volatility: 0.01347839674086385,
                    sharpe_ratio: 0.03545878152354819
                }
            }
        },
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [benchmark_dto_1.BenchmarkDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "compareWithBenchmark", null);
exports.PortfolioController = PortfolioController = __decorate([
    (0, swagger_1.ApiTags)('Portfolio'),
    (0, common_1.Controller)('portfolio'),
    __metadata("design:paramtypes", [portfolio_service_1.PortfolioService])
], PortfolioController);
//# sourceMappingURL=portfolio.controller.js.map