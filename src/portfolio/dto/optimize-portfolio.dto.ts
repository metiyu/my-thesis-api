// src/portfolio/dto/optimize-portfolio.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class OptimizePortfolioDto {
    @ApiProperty({
        example: ["BBCA.JK", "BMRI.JK", "ITMG.JK", "MDKA.JK", "ADRO.JK", "AKRA.JK", "TBIG.JK"],
        description: 'Daftar ticker saham yang akan dioptimalkan',
    })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    tickers: string[];

    @ApiProperty({
        example: '2020-01-01',
        description: 'Tanggal mulai data historis (format YYYY-MM-DD)',
    })
    @IsDateString()
    startDate: string;

    @ApiProperty({
        example: '2025-01-01',
        description: 'Tanggal akhir data historis (format YYYY-MM-DD)',
    })
    @IsDateString()
    endDate: string;

    @ApiProperty({
        enum: ['modified_sharpe', 'min_cvar', 'mean_cvar'],
        description: 'Strategi optimasi portofolio',
        default: 'modified_sharpe',
    })
    @IsNotEmpty()
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
    @IsOptional()
    constraints?: {
        min_weight?: number;
        max_weight?: number;
    };
}