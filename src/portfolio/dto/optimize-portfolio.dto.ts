// src/portfolio/dto/optimize-portfolio.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class OptimizePortfolioDto {
    @ApiProperty({
        example: ["BBCA.JK", "BMRI.JK", "ITMG.JK", "MDKA.JK", "ADRO.JK", "AKRA.JK", "TBIG.JK"],
        description: 'Daftar ticker saham yang akan dioptimalkan',
    })
    tickers: string[];

    @ApiProperty({
        example: '2020-01-01',
        description: 'Tanggal mulai data historis (format YYYY-MM-DD)',
    })
    startDate: string;

    @ApiProperty({
        example: '2025-01-01',
        description: 'Tanggal akhir data historis (format YYYY-MM-DD)',
    })
    endDate: string;

    @ApiProperty({
        enum: ['modified_sharpe', 'min_cvar', 'mean_cvar'],
        description: 'Strategi optimasi portofolio',
        default: 'modified_sharpe',
    })
    strategy: 'modified_sharpe' | 'min_cvar' | 'mean_cvar';

    @ApiProperty({
        type: Object,
        required: false,
        description: 'Batasan berat alokasi portofolio per aset',
        example: {
            min_weight: 0.05,
            max_weight: 0.3,
        },
    })
    constraints?: {
        min_weight?: number;
        max_weight?: number;
    };
}