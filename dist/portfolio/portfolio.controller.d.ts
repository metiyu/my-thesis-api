import { PortfolioService } from './portfolio.service';
import { DownloadDataDto } from './dto/download-data.dto';
import { IndividualStockAnalysisDto } from './dto/individual-stock.dto';
import { OptimizePortfolioDto } from './dto/optimize-portfolio.dto';
import { EfficientFrontierDto } from './dto/efficient-frontier.dto';
import { MonteCarloSimulationDto } from './dto/monte-carlo.dto';
import { StatisticalTestDto } from './dto/statistical-test.dto';
import { ExtremeCaseAnalysisDto } from './dto/extreme-case.dto';
import { BenchmarkDto } from './dto/benchmark.dto';
import { StatisticalTestResponseDto } from './dto/statistical-test-response.dto';
export declare class PortfolioController {
    private readonly portfolioService;
    constructor(portfolioService: PortfolioService);
    downloadHistoricalData(dto: DownloadDataDto): Promise<any>;
    analyzeIndividualStocks(dto: IndividualStockAnalysisDto): Promise<any>;
    optimizePortfolio(dto: OptimizePortfolioDto): Promise<any>;
    generateEfficientFrontier(dto: EfficientFrontierDto): Promise<any>;
    monteCarloSimulation(dto: MonteCarloSimulationDto): Promise<any>;
    performStatisticalTest(dto: StatisticalTestDto): Promise<StatisticalTestResponseDto>;
    analyzeExtremeCases(dto: ExtremeCaseAnalysisDto): Promise<any>;
    compareWithBenchmark(dto: BenchmarkDto): Promise<any>;
}
