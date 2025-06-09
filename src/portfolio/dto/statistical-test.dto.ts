import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MonteCarloSimulationResultDto } from './monte-carlo-simulation-result.dto';

export class StatisticalTestDto {
    @ApiProperty({
        example: ['modified_sharpe', 'min_cvar'],
        description: 'Daftar strategi yang ingin dibandingkan',
    })
    @IsArray()
    @IsEnum(['modified_sharpe', 'min_cvar'], { each: true })
    strategies: ('modified_sharpe' | 'min_cvar')[];

    @ApiProperty({
        type: MonteCarloSimulationResultDto,
        isArray: true,
        example: [
            {
                simulation_id: 0,
                strategy: 'modified_sharpe',
                mean_return: 0.0009411815444667043,
                volatility: 0.021531198857040044,
                sharpe_ratio: 0.02208726084783764,
                historical_cvar_95: 0.042611963110801336
            },
            {
                simulation_id: 0,
                strategy: 'min_cvar',
                mean_return: -0.000027447848121537074,
                volatility: 0.013267789481132625,
                sharpe_ratio: -0.0010020755638337076,
                historical_cvar_95: 0.027390996360122787
            }
        ],
        description: 'Hasil simulasi Monte Carlo sebagai input untuk uji statistik',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MonteCarloSimulationResultDto)
    monteCarloResults: MonteCarloSimulationResultDto[];
}