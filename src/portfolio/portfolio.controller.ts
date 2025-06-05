// src/portfolio/portfolio.controller.ts

import {
    Controller,
    Post,
    Body,
    HttpStatus,
    HttpCode,
    Query,
    Get,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { DownloadDataDto } from './dto/download-data.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IndividualStockAnalysisDto } from './dto/individual-stock.dto';
import { OptimizePortfolioDto } from './dto/optimize-portfolio.dto';
import { EfficientFrontierDto } from './dto/efficient-frontier.dto';
import { MonteCarloSimulationDto } from './dto/monte-carlo.dto';
import { StatisticalTestDto } from './dto/statistical-test.dto';
import { ExtremeCaseAnalysisDto } from './dto/extreme-case.dto';
import { BenchmarkDto } from './dto/benchmark.dto';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) { }

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

    @Post('stat-test')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Lakukan uji statistik antar strategi optimasi portofolio' })
    @ApiResponse({
        status: 200,
        description: 'Berhasil melakukan uji statistik antar strategi',
        schema: {
            example: {
                statistical_tests: [
                    {
                        comparison: "modified_sharpe vs min_cvar",
                        metric: "mean_return",
                        p_value: 0.0001,
                        significant: true,
                    },
                    {
                        comparison: "modified_sharpe vs mean_cvar",
                        metric: "sharpe_ratio",
                        p_value: 0.0003,
                        significant: true,
                    }
                ]
            }
        }
    })
    async performStatisticalTest(@Body() dto: StatisticalTestDto) {
        return await this.portfolioService.performStatisticalTest(dto);
    }

    @Post('extreme-cases')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Analisis kasus ekstrem dari hasil simulasi Monte Carlo' })
    @ApiResponse({
        status: 200,
        description: 'Berhasil menganalisis kasus ekstrem',
        schema: {
            example: {
                extreme_cases: {
                    best_case: {
                        modified_sharpe: {
                            mean_return: 0.2917,
                            volatility: 2.1472,
                            sharpe_ratio: 0.136,
                        },
                        min_cvar: {
                            mean_return: 0.1894,
                            volatility: 1.56,
                            sharpe_ratio: 0.121,
                        },
                    },
                    worst_case: {
                        modified_sharpe: {
                            mean_return: 0.0913,
                            volatility: 1.76,
                            sharpe_ratio: 0.052,
                        },
                        min_cvar: {
                            mean_return: 0.0412,
                            volatility: 1.18,
                            sharpe_ratio: 0.035,
                        },
                    },
                },
            },
        },
    })
    async analyzeExtremeCases(@Body() dto: ExtremeCaseAnalysisDto) {
        return await this.portfolioService.analyzeExtremeCases(dto);
    }

    @Get('benchmark')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Bandingkan kinerja portofolio terhadap portofolio benchmark' })
    @ApiResponse({
        status: 200,
        description: 'Berhasil membandingkan performa portofolio',
        schema: {
            example: {
                benchmark_performance: {
                    mean_return: 0.000477,
                    volatility: 0.0135,
                    sharpe_ratio: 0.0355,
                },
                optimized_performance: {
                    modified_sharpe: {
                        mean_return: 0.0012,
                        volatility: 0.016,
                        sharpe_ratio: 0.0358,
                    },
                    min_cvar: {
                        mean_return: 0.0005,
                        volatility: 0.011,
                        sharpe_ratio: 0.032,
                    },
                },
            },
        },
    })
    async compareWithBenchmark(@Query() dto: BenchmarkDto) {
        return await this.portfolioService.compareWithBenchmark(dto);
    }
}