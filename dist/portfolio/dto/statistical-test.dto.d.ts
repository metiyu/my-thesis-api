import { MonteCarloSimulationResultDto } from './monte-carlo-simulation-result.dto';
export declare class StatisticalTestDto {
    strategies: ('modified_sharpe' | 'min_cvar')[];
    monteCarloResults: MonteCarloSimulationResultDto[];
}
