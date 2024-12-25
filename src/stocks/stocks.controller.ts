/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StocksService } from './stocks.service';
import { ConsistentStock, Stock } from './stock.entity';

@ApiTags('stocks')
@Controller('stocks')
export class StocksController {
    constructor(private readonly stocksService: StocksService) {}

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
    @ApiOperation({ summary: 'Get individual stocks analysis' })
    @ApiResponse({
        status: 200,
        description: 'Get individual stock analysis with Mean Return, Volatility, Sharpe Ratio, Skewness, Kurtosis data.',
        type: Stock,
    })
    async getStocksAnalysis(): Promise<StockAnalysis> {
        return this.stocksService.getStocksAnalysis()
    }

}
