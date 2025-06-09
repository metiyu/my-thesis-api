// src/portfolio/dto/monte-carlo-simulation-result.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class MonteCarloSimulationResultDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    simulation_id: number;

    @ApiProperty({ example: 'modified_sharpe' })
    @IsString()
    strategy: string;

    @ApiProperty({ example: 0.0012 })
    @IsNumber()
    mean_return: number;

    @ApiProperty({ example: 0.016 })
    @IsNumber()
    volatility: number;

    @ApiProperty({ example: 0.0358 })
    @IsNumber()
    sharpe_ratio: number;

    @ApiProperty({ example: 0.0339, required: false })
    @IsNumber()
    @IsOptional()
    historical_cvar_95?: number;
}