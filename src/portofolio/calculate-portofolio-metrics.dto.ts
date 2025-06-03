import { IsArray, IsObject } from 'class-validator';

export class CalculatePortofolioMetricsDto {
    @IsArray()
    weights: number[];

    @IsObject()
    returns_data: Record<string, number[]>;
}