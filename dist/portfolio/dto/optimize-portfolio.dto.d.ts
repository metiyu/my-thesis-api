export declare class OptimizePortfolioDto {
    tickers: string[];
    startDate: string;
    endDate: string;
    strategy: 'modified_sharpe' | 'min_cvar' | 'mean_cvar';
    constraints?: {
        min_weight?: number;
        max_weight?: number;
    };
}
