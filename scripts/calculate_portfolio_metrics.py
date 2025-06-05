# script/calculate_portfolio_metrics.py
import numpy as np
import pandas as pd
from scipy import stats
import sys
import json

class RobustPortfolioOptimizer:
    def __init__(self, returns_data):
        self.returns = returns_data

    def calculate_historical_var(self, weights, confidence_level=0.95):
        portfolio_returns = self.returns @ weights
        return -np.percentile(portfolio_returns, (1 - confidence_level) * 100)

    def calculate_historical_cvar(self, weights, confidence_level=0.95):
        portfolio_returns = self.returns @ weights
        var = -np.percentile(portfolio_returns, (1 - confidence_level) * 100)
        return -np.mean(portfolio_returns[portfolio_returns <= -var])

    def calculate_modified_sharpe(self, weights):
        mean_return = np.mean(self.returns @ weights)
        cvar = self.calculate_historical_cvar(weights)
        return mean_return / cvar if cvar != 0 else -np.inf

    def calculate_portfolio_metrics(self, weights):
        portfolio_returns = self.returns @ weights
        metrics = {
            'mean_return': float(np.mean(portfolio_returns)),
            'volatility': float(np.std(portfolio_returns)),
            'historical_var_95': float(self.calculate_historical_var(weights)),
            'historical_cvar_95': float(self.calculate_historical_cvar(weights)),
            'modified_sharpe': float(self.calculate_modified_sharpe(weights)),
            'skewness': float(stats.skew(portfolio_returns)),
            'kurtosis': float(stats.kurtosis(portfolio_returns))
        }
        return metrics


if __name__ == "__main__":
    try:
        # Parse input dari command line
        weights = json.loads(sys.argv[1])
        returns_data = pd.DataFrame(json.loads(sys.argv[2]))

        # Validasi dimensi
        if len(weights) != len(returns_data.columns):
            raise ValueError("Panjang weights harus sama dengan jumlah kolom di returns_data")

        optimizer = RobustPortfolioOptimizer(returns_data)
        metrics = optimizer.calculate_portfolio_metrics(weights)

        print(json.dumps(metrics))

    except Exception as e:
        print(json.dumps({"error": str(e)}))