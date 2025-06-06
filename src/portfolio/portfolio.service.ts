// src/portfolio/portfolio.service.ts

import { Injectable } from '@nestjs/common';
import { PythonService } from '../python/python.service';
import { DownloadDataDto } from './dto/download-data.dto';
import { IndividualStockAnalysisDto } from './dto/individual-stock.dto';
import { OptimizePortfolioDto } from './dto/optimize-portfolio.dto';
import { EfficientFrontierDto } from './dto/efficient-frontier.dto';
import { MonteCarloSimulationDto } from './dto/monte-carlo.dto';
import { StatisticalTestDto } from './dto/statistical-test.dto';
import { ExtremeCaseAnalysisDto } from './dto/extreme-case.dto';
import { BenchmarkDto } from './dto/benchmark.dto';
import { StatisticalTestResponseDto } from './dto/statistical-test-response.dto';

@Injectable()
export class PortfolioService {
    constructor(private readonly pythonService: PythonService) { }

    async downloadData(dto: DownloadDataDto): Promise<any> {
        return this.pythonService.executePythonScript('download_data.py', [dto]);
    }

    async analyzeIndividualStocks(dto: IndividualStockAnalysisDto): Promise<any> {
        return this.pythonService.executePythonScript('analyze_individual_stocks.py', [dto]);
    }

    async optimizePortfolio(dto: OptimizePortfolioDto): Promise<any> {
        return this.pythonService.executePythonScript('optimize_portfolio.py', [dto]);
    }

    async generateEfficientFrontier(dto: EfficientFrontierDto): Promise<any> {
        return this.pythonService.executePythonScript('generate_efficient_frontier.py', [dto]);
    }

    async monteCarloSimulation(dto: MonteCarloSimulationDto): Promise<any> {
        return this.pythonService.executePythonScript('monte_carlo_simulation.py', [dto]);
    }

    async performStatisticalTest(dto: StatisticalTestDto): Promise<StatisticalTestResponseDto> {
        return this.pythonService.executePythonScript('statistical_test.py', [dto]);
    }

    async analyzeExtremeCases(dto: ExtremeCaseAnalysisDto): Promise<any> {
        return this.pythonService.executePythonScript('analyze_extreme_cases.py', [dto]);
    }

    async compareWithBenchmark(dto: BenchmarkDto): Promise<any> {
        return this.pythonService.executePythonScript('compare_benchmark.py', [dto]);
    }
}