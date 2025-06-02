import { IsArray, IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class AnalyzeStocksDto {
    @Transform(({ value }) => {
        if (typeof value === 'string') return [value];
        if (Array.isArray(value)) return value.map((v) => v.toString());
        return [];
    })
    tickers: string[];

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsString({ message: 'Metric must be a string or will be converted to one' })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return [value];
        }
        if (Array.isArray(value)) {
            return value.map((v) => v.toString());
        }
        return [];
    })
    @IsOptional()
    metrics?: string[];
}