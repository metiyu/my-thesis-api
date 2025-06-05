// src/portfolio/dto/export-result.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class ExportResultDto {
    @ApiProperty({
        example: 'csv',
        enum: ['csv', 'xlsx'],
        description: 'Format file ekspor (csv atau xlsx)',
    })
    format: 'csv' | 'xlsx';

    @ApiProperty({
        example: {
            returns_data: {
                BBCA: [0.01, -0.005, 0.003],
                BMRI: [0.015, -0.002, 0.007],
            },
            stock_metrics: {
                BBCA: {
                    mean_return: 0.0012,
                    volatility: 0.016,
                    sharpe_ratio: 0.0358,
                },
            },
            portfolio_results: {
                modified_sharpe: {
                    weights: { BBCA: 0.25, BMRI: 0.3, ITMG: 0.15 },
                    metrics: { mean_return: 0.0012, volatility: 0.016 }
                }
            }
        },
        description: 'Data mentah yang akan diekspor',
    })
    data: any;
}