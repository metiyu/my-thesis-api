// src/portfolio/dto/monte-carlo.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from 'class-validator';

export class MonteCarloSimulationDto {
    @ApiProperty({
        example: ['BBCA.JK', 'BMRI.JK', 'ITMG.JK', 'MDKA.JK', 'ADRO.JK', 'AKRA.JK', 'TBIG.JK'],
        description: 'Daftar ticker saham yang digunakan dalam simulasi',
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

    @ApiProperty({
        example: 1000,
        minimum: 100,
        maximum: 10000,
        description: 'Jumlah iterasi simulasi Monte Carlo',
    })
    @IsNotEmpty()
    n_simulations: number;
}