import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsString } from 'class-validator';

export class DownloadReturnsDto {
    @ApiProperty({
        example: ["BBCA.JK", "BBRI.JK"],
        description: 'Daftar ticker saham yang ingin diambil data historisnya'
    })
    @IsArray()
    @IsString({ each: true })
    tickers: string[];

    @ApiProperty({
        example: '2020-01-01',
        description: 'Tanggal mulai pengambilan data historis'
    })
    @IsDateString()
    start_date: string;

    @ApiProperty({
        example: '2024-12-31',
        description: 'Tanggal akhir pengambilan data historis'
    })
    @IsDateString()
    end_date: string;
}