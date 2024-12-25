/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ConsistentStock, Stock } from './stock.entity';
import { StockDto } from './stock.dto';
import { PythonService } from 'src/python/python.service';

@Injectable()
export class StocksService {
    constructor(private readonly pythonService: PythonService) {}

    async getStocksConsistency(): Promise<ConsistentStock> {
        const result = await this.pythonService.executePythonScript(
            'get_stock.py',
            []
        );
        return result;
    }

    async getStocksAnalysis(
        options: StockDto,
    ): Promise<Stock> {
        const result = await this.pythonService.executePythonScript(
            'individual_stock_analysis.py',
            [
                options.symbol,
                options.startDate,
                options.endDate || new Date().toISOString(),
                options.timeFrame,
            ],
        );
        return result;
    }
}
