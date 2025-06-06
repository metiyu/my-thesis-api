# scripts/statistical_test.py

import sys
import json
import pandas as pd
from scipy import stats
import traceback

def perform_statistical_test(monte_carlo_results):
    results = []
    
    # Convert to DataFrame
    df = pd.DataFrame(monte_carlo_results)
    
    # Debug: Print DataFrame info
    print(f"DataFrame shape: {df.shape}", file=sys.stderr)
    print(f"DataFrame columns: {df.columns.tolist()}", file=sys.stderr)
    print(f"First few rows:\n{df.head()}", file=sys.stderr)
    
    # Get unique strategies (note: 'strategy' not 'strategies')
    if 'strategy' not in df.columns:
        raise ValueError(f"'strategy' column not found. Available columns: {df.columns.tolist()}")
    
    strategies = df['strategy'].unique()
    print(f"Found strategies: {strategies}", file=sys.stderr)
    
    # Metrics to test
    metrics_to_test = ['mean_return', 'sharpe_ratio', 'volatility', 'historical_cvar_95']
    
    # Filter metrics that actually exist in the data
    available_metrics = [metric for metric in metrics_to_test if metric in df.columns]
    print(f"Available metrics for testing: {available_metrics}", file=sys.stderr)
    
    if len(available_metrics) == 0:
        raise ValueError(f"No test metrics found. Available columns: {df.columns.tolist()}")
    
    # Perform pairwise comparisons
    for i, strat1 in enumerate(strategies):
        for j, strat2 in enumerate(strategies):
            if i < j:  # Only compare each pair once
                for metric in available_metrics:
                    # Get data for each strategy
                    data1 = df[df['strategy'] == strat1][metric].dropna()
                    data2 = df[df['strategy'] == strat2][metric].dropna()
                    
                    print(f"Comparing {strat1} vs {strat2} on {metric}", file=sys.stderr)
                    print(f"  {strat1}: {len(data1)} samples, mean={data1.mean():.6f}", file=sys.stderr)
                    print(f"  {strat2}: {len(data2)} samples, mean={data2.mean():.6f}", file=sys.stderr)
                    
                    # Need at least 2 samples for t-test
                    if len(data1) < 2 or len(data2) < 2:
                        print(f"  Skipping: insufficient data", file=sys.stderr)
                        continue
                    
                    # Perform t-test
                    try:
                        t_stat, p_val = stats.ttest_ind(data1, data2)
                        
                        # Calculate effect size (Cohen's d)
                        pooled_std = ((len(data1) - 1) * data1.std()**2 + (len(data2) - 1) * data2.std()**2) / (len(data1) + len(data2) - 2)
                        pooled_std = pooled_std**0.5
                        cohens_d = (data1.mean() - data2.mean()) / pooled_std if pooled_std > 0 else 0
                        
                        results.append({
                            'comparison': f"{strat1} vs {strat2}",
                            'metric': metric,
                            't_statistic': float(t_stat),
                            'p_value': float(p_val),
                            'significant': bool(p_val < 0.05),
                            'cohens_d': float(cohens_d),
                            'mean_diff': float(data1.mean() - data2.mean()),
                            'strategy1_mean': float(data1.mean()),
                            'strategy2_mean': float(data2.mean()),
                            'strategy1_samples': int(len(data1)),
                            'strategy2_samples': int(len(data2))
                        })
                        
                        print(f"  t-stat={t_stat:.4f}, p-val={p_val:.6f}, significant={p_val < 0.05}", file=sys.stderr)
                        
                    except Exception as e:
                        print(f"  Error in t-test: {str(e)}", file=sys.stderr)
                        continue
    
    # Add summary statistics
    summary = {
        'total_comparisons': len(results),
        'significant_comparisons': sum(1 for r in results if r['significant']),
        'strategies_tested': strategies.tolist(),
        'metrics_tested': available_metrics,
        'total_simulations': len(df)
    }
    
    return {
        'statistical_tests': results,
        'summary': summary
    }

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
        monte_carlo_results = params.get('monteCarloResults', {}).get('simulation_results', [])
        
        if not monte_carlo_results:
            raise ValueError("monteCarloResults are required")
        
        # Perform statistical tests
        result = perform_statistical_test(monte_carlo_results)
        
        # Output result to stdout for the calling process
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        error_output = {
            'error': str(e), 
            'trace': traceback.format_exc()
        }
        print(json.dumps(error_output), file=sys.stdout)
        sys.exit(1)