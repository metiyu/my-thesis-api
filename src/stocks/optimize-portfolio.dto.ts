import { IsArray, IsDateString, IsNotEmpty, IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

class ConstraintsDto {
    @ApiProperty({
        example: 0.1,
        description: 'Minimal alokasi dana per saham (contoh: 0.1 = 10%)',
        required: false
    })
    min_weight?: number;

    @ApiProperty({
        example: 0.5,
        description: 'Maksimal alokasi dana per saham (contoh: 0.5 = 50%)',
        required: false
    })
    max_weight?: number;
}

@ApiExtraModels(ConstraintsDto)
export class OptimizePortfolioDto {
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
        example: 'modified_sharpe',
        enum: ['modified_sharpe', 'min_cvar', 'mean_cvar'],
        description: 'Strategi optimasi portofolio yang digunakan'
    })
    @IsString()
    @IsNotEmpty()
    strategy: 'modified_sharpe' | 'min_cvar' | 'mean_cvar';

    @ApiProperty({
        type: ConstraintsDto,
        description: 'Batasan alokasi dana per saham (opsional)',
        required: false
    })
    @ValidateNested()
    @Type(() => ConstraintsDto)
    @IsOptional()
    constraints?: ConstraintsDto;
}