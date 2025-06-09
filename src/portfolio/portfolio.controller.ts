// src/portfolio/portfolio.controller.ts

import {
    Controller,
    Post,
    Body,
    HttpStatus,
    HttpCode,
    Query,
    Get,
    UseGuards,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { DownloadDataDto } from './dto/download-data.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { IndividualStockAnalysisDto } from './dto/individual-stock.dto';
import { OptimizePortfolioDto } from './dto/optimize-portfolio.dto';
import { EfficientFrontierDto } from './dto/efficient-frontier.dto';
import { MonteCarloSimulationDto } from './dto/monte-carlo.dto';
import { StatisticalTestDto } from './dto/statistical-test.dto';
import { ExtremeCaseAnalysisDto } from './dto/extreme-case.dto';
import { BenchmarkDto } from './dto/benchmark.dto';
import { StatisticalTestResponseDto } from './dto/statistical-test-response.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) { }

    @UseGuards(ThrottlerGuard)
    @Post('download')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Download data historis saham' })
    @ApiResponse({
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
    })
    async downloadHistoricalData(@Body() dto: DownloadDataDto) {
        return await this.portfolioService.downloadData(dto);
    }

    @UseGuards(ThrottlerGuard)
    @Post('analyze-individual')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Analisis statistik individu tiap saham' })
    @ApiResponse({
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
    })
    async analyzeIndividualStocks(@Body() dto: IndividualStockAnalysisDto) {
        return await this.portfolioService.analyzeIndividualStocks(dto);
    }

    @UseGuards(ThrottlerGuard)
    @Post('optimize')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Optimasi portofolio menggunakan strategi tertentu' })
    @ApiResponse({
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
    })
    async optimizePortfolio(@Body() dto: OptimizePortfolioDto) {
        return await this.portfolioService.optimizePortfolio(dto);
    }

    @UseGuards(ThrottlerGuard)
    @Post('frontier')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate efficient frontier berdasarkan variasi target return' })
    @ApiResponse({
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
    })
    async generateEfficientFrontier(@Body() dto: EfficientFrontierDto) {
        return await this.portfolioService.generateEfficientFrontier(dto);
    }

    @UseGuards(ThrottlerGuard)
    @Post('monte-carlo')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Lakukan simulasi Monte Carlo untuk membandingkan strategi optimasi' })
    @ApiResponse({
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
    })
    async monteCarloSimulation(@Body() dto: MonteCarloSimulationDto) {
        return await this.portfolioService.monteCarloSimulation(dto);
    }

    @UseGuards(ThrottlerGuard)
    @Post('stat-test')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Lakukan uji statistik antar strategi optimasi portofolio' })
    @ApiBody({ type: StatisticalTestDto })
    @ApiResponse({
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
    })
    async performStatisticalTest(@Body() dto: StatisticalTestDto): Promise<StatisticalTestResponseDto> {
        console.log('Performing statistical test with DTO:', dto);

        return await this.portfolioService.performStatisticalTest(dto);
    }

    @UseGuards(ThrottlerGuard)
    @Post('extreme-cases')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Analisis kasus ekstrem dari hasil simulasi Monte Carlo' })
    @ApiResponse({
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
    })
    async analyzeExtremeCases(@Body() dto: ExtremeCaseAnalysisDto) {
        return await this.portfolioService.analyzeExtremeCases(dto);
    }

    @UseGuards(ThrottlerGuard)
    @Get('benchmark')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Bandingkan kinerja portofolio terhadap portofolio benchmark' })
    @ApiResponse({
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
    })
    async compareWithBenchmark(@Query() dto: BenchmarkDto) {
        return await this.portfolioService.compareWithBenchmark(dto);
    }
}