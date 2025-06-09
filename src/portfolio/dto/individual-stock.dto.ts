// src/portfolio/dto/individual-stock.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from 'class-validator';

export class IndividualStockAnalysisDto {
    @ApiProperty({
        example: ['BBCA.JK', 'BBRI.JK'],
        description: 'Daftar ticker saham untuk dianalisis',
    })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    tickers: string[];

    @ApiProperty({
        example: '2020-01-01',
        description: 'Tanggal mulai analisis (format YYYY-MM-DD)',
    })
    @IsDateString()
    startDate: string;

    @ApiProperty({
        example: '2025-01-01',
        description: 'Tanggal akhir analisis (format YYYY-MM-DD)',
    })
    @IsDateString()
    endDate: string;
}