import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class MonteCarloDto {
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
        example: '1000',
        description: 'Jumlah simulasi Monte Carlo yang dilakukan',
    })
    @IsInt()
    @IsNotEmpty()
    n_simulations: number;

    @ApiProperty({
        example: ['modified_sharpe', 'min_cvar', 'mean_cvar'],
        description: 'Daftar strategi optimasi portofolio yang disimulasikan',
    })
    @IsArray()
    @IsString({ each: true })
    strategies: ('modified_sharpe' | 'min_cvar' | 'mean_cvar')[];
}