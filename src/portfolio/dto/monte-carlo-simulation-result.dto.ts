// src/portfolio/dto/monte-carlo-simulation-result.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class MonteCarloSimulationResultDto {
    @ApiProperty({ example: 1 })
    simulation_id: number;

    @ApiProperty({ example: 'modified_sharpe' })
    strategy: string;

    @ApiProperty({ example: 0.0012 })
    mean_return: number;

    @ApiProperty({ example: 0.016 })
    volatility: number;

    @ApiProperty({ example: 0.0358 })
    sharpe_ratio: number;

    @ApiProperty({ example: 0.0339, required: false })
    historical_cvar_95?: number;
}