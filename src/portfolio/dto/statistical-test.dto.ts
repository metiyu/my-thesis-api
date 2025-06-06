import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { MonteCarloSimulationResultDto } from './monte-carlo-simulation-result.dto';

export class StatisticalTestDto {
    @ApiProperty({
        example: ['modified_sharpe', 'min_cvar'],
        description: 'Daftar strategi yang ingin dibandingkan',
    })
    strategies: ('modified_sharpe' | 'min_cvar')[];

    @ApiProperty({
        type: 'array',
        items: { $ref: getSchemaPath(MonteCarloSimulationResultDto) },
        description: 'Hasil simulasi Monte Carlo sebagai input untuk uji statistik',
    })
    monteCarloResults: MonteCarloSimulationResultDto[];
}