/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AnalyzedStock, ConsistentStock, Stock } from './stock.entity';
import { StockDto } from './stock.dto';
import { PythonService } from 'src/python/python.service';
import { AnalyzeStocksDto } from './analyze-stocks.dto';
import { OptimizePortfolioDto } from './optimize-portfolio.dto';
import { EfficientFrontierDto } from './efficient-frontier.dto';
import { MonteCarloDto } from './monte-carlo.dto';

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

    async generateEfficientFrontier(dto: EfficientFrontierDto): Promise<any> {
        const args = [
            JSON.stringify(dto.tickers),
            dto.start_date,
            dto.end_date,
            dto.n_points.toString()
        ];

        const result = await this.pythonService.executePythonScript(
            'efficient_frontier.py',
            args
        );

        if (typeof result === 'object' && 'error' in result) {
            throw new HttpException(result, HttpStatus.BAD_REQUEST);
        }

        return result;
    }

    async runMonteCarloSimulation(dto: MonteCarloDto): Promise<any> {
        const args = [
            JSON.stringify(dto.tickers),
            dto.start_date,
            dto.end_date,
            dto.n_simulations.toString(),
            JSON.stringify(dto.strategies)
        ];

        const result = await this.pythonService.executePythonScript(
            'monte_carlo_simulation.py',
            args
        );

        if (typeof result === 'object' && 'error' in result) {
            throw new HttpException(result, HttpStatus.BAD_REQUEST);
        }

        return result;
    }
}
