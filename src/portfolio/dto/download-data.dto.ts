// src/portfolio/dto/download-data.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from 'class-validator';

export class DownloadDataDto {
    @ApiProperty({
        example: ['BBCA.JK', 'BBRI.JK'],
        description: 'Daftar ticker saham yang ingin diunduh datanya',
    })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    tickers: string[];

    @ApiProperty({
        example: '2020-01-01',
        description: 'Tanggal awal pengambilan data (format YYYY-MM-DD)',
    })
    @IsDateString()
    startDate: string;

    @ApiProperty({
        example: '2025-01-01',
        description: 'Tanggal akhir pengambilan data (format YYYY-MM-DD)',
    })
    @IsDateString()
    endDate: string;
}