# scripts/analyze_extreme_cases.py

import sys
import json
import pandas as pd
import warnings
import traceback

warnings.filterwarnings("ignore")

def analyze_extreme_cases(monte_carlo_data):
    if 'simulation_results' in monte_carlo_data:
        simulation_results = monte_carlo_data['simulation_results']
    else:
        simulation_results = monte_carlo_data

    df = pd.DataFrame(simulation_results)

    if df.empty or 'strategy' not in df.columns:
        raise ValueError("Invalid input data")

    strategies = df['strategy'].unique()
    results = {'extreme_cases': {}}

    for strategy in strategies:
        strat_df = df[df['strategy'] == strategy]
        best_case = strat_df[strat_df['mean_return'] >= strat_df['mean_return'].quantile(0.95)].iloc[0].to_dict()
        worst_case = strat_df[strat_df['mean_return'] <= strat_df['mean_return'].quantile(0.05)].iloc[0].to_dict()

        results['extreme_cases'][strategy] = {
            'best_case': {
                'mean_return': float(best_case.get('mean_return', 0)),
                'volatility': float(best_case.get('volatility', 0)),
                'sharpe_ratio': float(best_case.get('sharpe_ratio', 0)),
            },
            'worst_case': {
                'mean_return': float(worst_case.get('mean_return', 0)),
                'volatility': float(worst_case.get('volatility', 0)),
                'sharpe_ratio': float(worst_case.get('sharpe_ratio', 0)),
            },
        }

    return results

if __name__ == '__main__':
    try:
        # Debug logging
        print("ARGV:", sys.argv, file=sys.stderr)
        
        if len(sys.argv) < 2:
            raise ValueError("Missing input JSON")
        
        # 🔁 Baca dari file bukan dari argv
        temp_file = sys.argv[1]
        with open(temp_file, 'r') as f:
            params = json.load(f)
        
        # Get monte carlo results
        monte_carlo_results = params.get('monteCarloResults', {})
        
        if not monte_carlo_results:
            raise ValueError("monteCarloResults are required")
        
        # Perform statistical tests
        result = analyze_extreme_cases(monte_carlo_results)
        
        # Output result to stdout for the calling process
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        error_output = {
            'error': str(e), 
            'trace': traceback.format_exc()
        }
        print(json.dumps(error_output), file=sys.stdout)
        sys.exit(1)