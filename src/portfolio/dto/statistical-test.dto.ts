// src/portfolio/dto/statistical-test.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class StatisticalTestDto {
    @ApiProperty({
        example: ['modified_sharpe', 'min_cvar', 'mean_cvar'],
        description: 'Daftar strategi yang ingin dibandingkan',
    })
    strategies: ('modified_sharpe' | 'min_cvar' | 'mean_cvar')[];

    @ApiProperty({
        example: {
            simulation_results: [
                {
                    simulation_id: 1,
                    strategy: 'modified_sharpe',
                    mean_return: 0.0012,
                    volatility: 0.016,
                    sharpe_ratio: 0.0358,
                    historical_cvar_95: 0.0339,
                },
                {
                    simulation_id: 1,
                    strategy: 'min_cvar',
                    mean_return: 0.0005,
                    volatility: 0.011,
                    sharpe_ratio: 0.032,
                    historical_cvar_95: 0.021,
                },
            ],
        },
        description: 'Hasil simulasi Monte Carlo sebagai input untuk uji statistik',
    })
    monteCarloResults: any;
}