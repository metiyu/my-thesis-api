import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';

export enum TimeFrame {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
}

export class StockDto {
    @ApiProperty({
        example: 'AAPL',
        description: 'Stock ticker symbol',
    })
    @IsString()
    symbol: string;

    @ApiProperty({
        example: '2024-01-01',
        description: 'Start date for analysis',
    })
    @IsDateString()
    startDate: string;

    @ApiProperty({
        example: '2024-12-31',
        description: 'End date for analysis',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @ApiProperty({
        enum: TimeFrame,
        example: TimeFrame.DAILY,
        description: 'Time frame for analysis',
        required: false,
    })
    @IsEnum(TimeFrame)
    @IsOptional()
    timeFrame?: TimeFrame = TimeFrame.DAILY;
}
