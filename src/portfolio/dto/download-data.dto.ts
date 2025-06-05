// src/portfolio/dto/download-data.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class DownloadDataDto {
    @ApiProperty({
        example: ['BBCA.JK', 'BBRI.JK'],
        description: 'Daftar ticker saham yang ingin diunduh datanya',
    })
    tickers: string[];

    @ApiProperty({
        example: '2020-01-01',
        description: 'Tanggal awal pengambilan data (format YYYY-MM-DD)',
    })
    startDate: string;

    @ApiProperty({
        example: '2025-01-01',
        description: 'Tanggal akhir pengambilan data (format YYYY-MM-DD)',
    })
    endDate: string;
}