/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AnalyzedStock, ConsistentStock, Stock } from './stock.entity';
import { StockDto } from './stock.dto';
import { PythonService } from 'src/python/python.service';
import { AnalyzeStocksDto } from './analyze-stocks.dto';
import { OptimizePortfolioDto } from './optimize-portfolio.dto';

@Injectable()
export class StocksService {
    constructor(private readonly pythonService: PythonService) { }

    async getStocksConsistency(): Promise<ConsistentStock> {
        const result = await this.pythonService.executePythonScript(
            'get_stock.py',
            []
        );
        return result;
    }

    async getStocksAnalysis(): Promise<AnalyzedStock> {
        const result = await this.pythonService.executePythonScript(
            'individual_stock_analysis.py',
            [],
        );
        return result;
    }

    async analyzeIndividualStocks(dto: AnalyzeStocksDto): Promise<any> {
        const args = [
            JSON.stringify(dto.tickers),
            dto.startDate,
            dto.endDate,
            JSON.stringify(dto.metrics || [])
        ];

        const result = await this.pythonService.executePythonScript(
            'analyze_stocks.py',
            args
        );

        // Jika Python script mengembalikan error dalam format JSON
        if (typeof result === 'object' && 'error' in result) {
            throw new HttpException(result, HttpStatus.BAD_REQUEST);
        }

        return result;
    }

    async optimizePortfolio(dto: OptimizePortfolioDto): Promise<any> {
        const args = [
            JSON.stringify(dto.tickers),
            dto.start_date,
            dto.end_date,
            dto.strategy,
            JSON.stringify(dto.constraints || {})
        ];

        const result = await this.pythonService.executePythonScript(
            'optimize_portfolio.py',
            args
        );

        if (typeof result === 'object' && 'error' in result) {
            throw new HttpException(result, HttpStatus.BAD_REQUEST);
        }

        // Format hasil
        const weights = Array.isArray(result) ? result : JSON.parse(result);
        return {
            weights,
            total_weight: weights.reduce((sum, w) => sum + w, 0)
        };
    }
}
