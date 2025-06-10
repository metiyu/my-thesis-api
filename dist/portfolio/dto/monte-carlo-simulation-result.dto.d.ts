export declare class MonteCarloSimulationResultDto {
    simulation_id: number;
    strategy: string;
    mean_return: number;
    volatility: number;
    sharpe_ratio: number;
    historical_cvar_95?: number;
}
