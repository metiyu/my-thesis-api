import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PythonService } from '../python/python.service';
import { CalculatePortofolioMetricsDto } from './calculate-portofolio-metrics.dto';
import { DownloadReturnsDto } from './download-returns.dto';

@Injectable()
export class PortofolioService {
    constructor(private readonly pythonService: PythonService) { }

    async calculatePortfolioMetrics(dto: CalculatePortofolioMetricsDto): Promise<any> {
        const args = [
            JSON.stringify(dto.weights),
            JSON.stringify(dto.returns_data)
        ];

        const result = await this.pythonService.executePythonScript(
            'calculate_portfolio_metrics.py',
            args
        );

        if (typeof result === 'object' && 'error' in result) {
            throw new HttpException(result, HttpStatus.BAD_REQUEST);
        }

        return result;
    }
    async downloadReturns(dto: DownloadReturnsDto): Promise<any> {
        const args = [
            JSON.stringify(dto.tickers),
            dto.start_date,
            dto.end_date
        ];

        const result = await this.pythonService.executePythonScript('download_returns.py', args);

        if (typeof result === 'object' && 'error' in result) {
            throw new HttpException(result, HttpStatus.BAD_REQUEST);
        }

        return result;
    }

}