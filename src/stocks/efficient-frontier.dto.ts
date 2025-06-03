import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class EfficientFrontierDto {
    @ApiProperty({
        example: ["BBCA.JK", "BBRI.JK"],
        description: 'Daftar ticker saham yang ingin dioptimalkan'
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

    @ApiProperty({
        example: '20',
        description: 'Jumlah titik pada kurva efisien frontier',
    })
    @IsInt()
    @IsNotEmpty()
    n_points: number;
}