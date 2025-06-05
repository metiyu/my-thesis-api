// src/portfolio/dto/extreme-case.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class ExtremeCaseAnalysisDto {
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
                    simulation_id: 2,
                    strategy: 'min_cvar',
                    mean_return: 0.0005,
                    volatility: 0.011,
                    sharpe_ratio: 0.032,
                    historical_cvar_95: 0.021,
                }
            ],
        },
        description: 'Hasil simulasi Monte Carlo dari endpoint sebelumnya',
    })
    monteCarloResults: any[];
}