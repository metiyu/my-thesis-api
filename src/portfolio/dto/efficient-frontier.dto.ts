// src/portfolio/dto/efficient-frontier.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class EfficientFrontierDto {
    @ApiProperty({
        example: ['BBCA.JK', 'BMRI.JK', 'ITMG.JK', 'MDKA.JK', 'ADRO.JK', 'AKRA.JK', 'TBIG.JK'],
        description: 'Daftar ticker saham yang akan digunakan untuk generate efficient frontier',
    })
    tickers: string[];

    @ApiProperty({
        example: '2020-01-01',
        description: 'Tanggal mulai analisis (format YYYY-MM-DD)',
    })
    startDate: string;

    @ApiProperty({
        example: '2025-01-01',
        description: 'Tanggal akhir analisis (format YYYY-MM-DD)',
    })
    endDate: string;

    @ApiProperty({
        example: 100,
        minimum: 10,
        maximum: 1000,
        description: 'Jumlah titik pada efficient frontier',
    })
    n_points?: number;
}