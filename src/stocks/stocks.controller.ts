/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StocksService } from './stocks.service';
import { AnalyzedStock, ConsistentStock, Stock } from './stock.entity';
import { AnalyzeStocksDto } from './analyze-stocks.dto';
import { OptimizePortfolioDto } from './optimize-portfolio.dto';
import { EfficientFrontierDto } from './efficient-frontier.dto';
import { MonteCarloDto } from './monte-carlo.dto';

@ApiTags('stocks')
@Controller('stocks')
export class StocksController {
    constructor(private readonly stocksService: StocksService) { }

    @Get('consistency')
    @ApiOperation({ summary: 'Get consistent stocks' })
    @ApiResponse({
        status: 200,
        description: 'Get stocks that are consistently in the LQ45 index during 2020 - 2024',
        type: Stock,
    })
    async getStocksConsistency(): Promise<ConsistentStock> {
        return this.stocksService.getStocksConsistency()
    }

    @Get('individual-analysis')
    @ApiOperation({ summary: 'Analyze individual stocks with custom metrics' })
    @ApiQuery({ name: 'tickers', type: String, isArray: true, description: 'List of stock tickers (e.g. BBCA.JK, BBRI.JK) - Please using ".JK" for Indonesian Stocks' })
    @ApiQuery({ name: 'startDate', type: String, description: 'Start date in YYYY-MM-DD format' })
    @ApiQuery({ name: 'endDate', type: String, description: 'End date in YYYY-MM-DD format' })
    @ApiQuery({ name: 'metrics', type: String, isArray: true, required: false, description: 'Metrics to include (Mean Return, Volatility, Sharpe Ratio, Skewness, Kurtosis)' })
    @ApiResponse({
        status: 200,
        description: 'Returns analysis results for each ticker.',
        example: {
            "BBCA.JK": {
                "Mean Return": 0.000326,
                "Volatility": 0.01403,
                "Sharpe Ratio": 0.02326,
                "Skewness": 0.2575,
                "Kurtosis": 0.5751
            },
            "BBRI.JK": {
                "Mean Return": -0.000935,
                "Volatility": 0.01819,
                "Sharpe Ratio": -0.05141,
                "Skewness": -0.1326,
                "Kurtosis": 0.3346
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request or invalid parameters.',
        example: {
            "error": "Start date cannot be after end date."
        }
    })
    async analyzeIndividualStocks(
        @Query() dto: AnalyzeStocksDto
    ): Promise<any> {
        return this.stocksService.analyzeIndividualStocks(dto);
    }

    @Post('optimize-portfolio')
    @ApiOperation({ summary: 'Optimize portfolio based on selected strategy' })
    @ApiResponse({
        status: 200,
        description: 'Returns optimized portfolio weights.',
        example: {
            "weights": [0.4, 0.6],
            "total_weight": 1.0
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request or invalid parameters.',
        example: {
            "error": "Start date cannot be after end date."
        }
    })
    async optimizePortfolio(
        @Body() dto: OptimizePortfolioDto
    ): Promise<any> {
        return this.stocksService.optimizePortfolio(dto);
    }

    @Post('efficient-frontier')
    @ApiOperation({ summary: 'Generate efficient frontier based on historical returns' })
    @ApiBody({ type: EfficientFrontierDto })
    @ApiResponse({
        status: 200,
        description: 'Returns a list of points on the efficient frontier.',
        example: [{
            "return": 0.0012,
            "risk": 0.0189,
            "weights": [0.3, 0.7]
        }]
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request or invalid parameters.',
        example: {
            "error": "Start date cannot be after end date."
        }
    })
    async generateEfficientFrontier(
        @Body() dto: EfficientFrontierDto
    ): Promise<any> {
        return this.stocksService.generateEfficientFrontier(dto);
    }

    @Post('monte-carlo-simulation')
    @ApiOperation({ summary: 'Run Monte Carlo simulation to compare portfolio strategies' })
    @ApiBody({ type: MonteCarloDto })
    @ApiResponse({
        status: 200,
        description: 'Returns a list of Monte Carlo simulation results.',
        example: [{
            "simulation_id": 0,
            "strategy": "modified_sharpe",
            "mean_return": 0.0012,
            "volatility": 0.0189,
            "sharpe_ratio": 0.063,
            "cvar": 0.021,
            "weights": [0.3, 0.7]
        }]
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request or invalid parameters.',
        example: {
            "error": "Start date cannot be after end date."
        }
    })
    async runMonteCarloSimulation(
        @Body() dto: MonteCarloDto
    ): Promise<any> {
        return this.stocksService.runMonteCarloSimulation(dto);
    }
}
