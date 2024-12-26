import { ApiProperty } from '@nestjs/swagger';

export class TechnicalIndicator {
    @ApiProperty()
    name: string;

    @ApiProperty()
    value: number;

    @ApiProperty()
    signal: 'buy' | 'sell' | 'neutral';
}

export class Stock {
    @ApiProperty()
    symbol: string;

    @ApiProperty()
    currentPrice: number;

    @ApiProperty()
    priceChange: number;

    @ApiProperty()
    percentageChange: number;

    @ApiProperty({ type: [TechnicalIndicator] })
    indicators: TechnicalIndicator[];

    @ApiProperty()
    lastUpdated: Date;
}

export class ConsistentStock {
    @ApiProperty()
    stock_code: string;

    @ApiProperty()
    consistency: number;

    @ApiProperty()
    ticker: string;
}

export class AnalyzedStock {
    @ApiProperty()
    ticker: string;

    @ApiProperty()
    meanReturn: number;

    @ApiProperty()
    volatility: number;

    @ApiProperty()
    sharpeRatio: number;

    @ApiProperty()
    skewness: number;

    @ApiProperty()
    kurtosis: number;
}