import {
    Controller,
    Post,
    Body,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PortofolioService } from './portofolio.service';
import { CalculatePortofolioMetricsDto } from './calculate-portofolio-metrics.dto';
import { DownloadReturnsDto } from './download-returns.dto';

@ApiTags('portofolio')
@Controller('portofolio')
export class PortofolioController {
    constructor(private readonly portfolioService: PortofolioService) { }

    @Post('calculate-portfolio-metrics')
    @ApiOperation({ summary: 'Calculate portfolio metrics based on given weights and historical returns' })
    @ApiResponse({
        status: 200,
        description: 'Returns portfolio metrics like mean return, volatility, Sharpe ratio, etc.',
        example: {
            "mean_return": 0.0012,
            "volatility": 0.0189,
            "historical_var_95": 0.021,
            "historical_cvar_95": 0.023,
            "modified_sharpe": 0.052,
            "skewness": 0.257,
            "kurtosis": 0.575
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request or invalid parameters.',
        example: {
            "error": "Length of weights must match the number of columns in returns_data"
        },
    })
    async calculatePortfolioMetrics(
        @Body() dto: CalculatePortofolioMetricsDto
    ): Promise<any> {
        return this.portfolioService.calculatePortfolioMetrics(dto);
    }

    @Post('download-returns')
    @ApiOperation({ summary: 'Download historical returns data for given tickers and date range' })
    @ApiResponse({
        status: 200,
        description: 'Returns historical returns data for the requested tickers',
        example: {
            "returns_data": {
                "BBCA.JK": [0.01, -0.005, 0.02, 0.003],
                "BBRI.JK": [-0.002, 0.015, 0.01, 0.007]
            },
            "valid_tickers": ["BBCA.JK", "BBRI.JK"]
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request or invalid parameters.',
        example: {
            "error": "Start date cannot be after end date."
        }
    })
    async downloadReturns(@Body() dto: DownloadReturnsDto): Promise<any> {
        return this.portfolioService.downloadReturns(dto);
    }
}