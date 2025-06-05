# scripts/optimize_portfolio.py

import sys
import json
import numpy as np
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize
import traceback
import warnings
warnings.filterwarnings("ignore", message=".*auto_adjust.*")

class RobustPortfolioOptimizer:
    def __init__(self, returns):
        self.returns = returns.values if isinstance(returns, pd.DataFrame) else returns
        self.n_assets = self.returns.shape[1]

    def calculate_historical_cvar(self, weights, confidence_level=0.95):
        portfolio_returns = self.returns @ weights
        var = -np.percentile(portfolio_returns, (1 - confidence_level) * 100)
        return -np.mean(portfolio_returns[portfolio_returns <= -var])

    def calculate_modified_sharpe(self, weights):
        mean_return = np.mean(self.returns @ weights)
        cvar = self.calculate_historical_cvar(weights)
        return mean_return / cvar if cvar != 0 else -np.inf

    def optimize(self, objective='modified_sharpe', bounds=None, constraints=None):
        initial_weights = np.ones(self.n_assets) / self.n_assets
        bounds = bounds or [(0, 1) for _ in range(self.n_assets)]
        constraints = [{'type': 'eq', 'fun': lambda x: np.sum(x) - 1}] + (constraints or [])

        if objective == 'modified_sharpe':
            objective_function = lambda x: -self.calculate_modified_sharpe(x)
        elif objective == 'min_cvar':
            objective_function = lambda x: self.calculate_historical_cvar(x)
        elif objective == 'mean_cvar':
            def objective_function(x):
                mean = np.mean(self.returns @ x)
                cvar = self.calculate_historical_cvar(x)
                return -(mean - 0.5 * cvar)
        else:
            raise ValueError(f"Invalid strategy: {objective}")

        result = minimize(objective_function, initial_weights, method='SLSQP', bounds=bounds, constraints=constraints)
        return result.x.tolist()

def get_historical_returns(tickers, start_date, end_date):
    df = pd.DataFrame()
    for ticker in tickers:
        try:
            stock_data = yf.download(ticker, start=start_date, end=end_date, auto_adjust=True, progress=False)['Close']
            if not stock_data.empty:
                df[ticker] = stock_data.pct_change().dropna()
        except Exception as e:
            print(f"Error fetching {ticker}: {e}")
    return df

def optimize_portfolio(tickers, start_date, end_date, strategy, constraints=None):
    returns_df = get_historical_returns(tickers, start_date, end_date)
    if returns_df.empty:
        return {"error": "No valid historical data found"}

    optimizer = RobustPortfolioOptimizer(returns_df)

    # Handle weight constraints
    min_wt = constraints.get("min_weight", 0) if constraints and "min_weight" in constraints else 0
    max_wt = constraints.get("max_weight", 1) if constraints and "max_weight" in constraints else 1
    bounds = [(min_wt, max_wt) for _ in range(len(tickers))]

    weights = optimizer.optimize(strategy, bounds=bounds)
    portfolio_return = np.mean(returns_df @ weights)
    portfolio_volatility = np.std(returns_df @ weights)
    portfolio_cvar = optimizer.calculate_historical_cvar(weights)
    modified_sharpe = portfolio_return / portfolio_cvar if portfolio_cvar != 0 else float('-inf')

    return {
        "optimized_weights": dict(zip(tickers, weights)),
        "metrics": {
            "mean_return": float(portfolio_return),
            "volatility": float(portfolio_volatility),
            "sharpe_ratio": float(modified_sharpe),
            "cvar_95": float(portfolio_cvar),
        },
    }

if __name__ == '__main__':
    try:
        # 🔍 Tambah log untuk debugging
        print("ARGV:", sys.argv, file=sys.stderr)  # <-- 🔍 Tambah baris ini

        if len(sys.argv) < 2:
            raise ValueError("Missing input JSON")

        # 🔁 Baca dari file bukan dari argv
        temp_file = sys.argv[1]
        with open(temp_file, 'r') as f:
            params = json.load(f)
            
        tickers = params.get('tickers')
        start_date = params.get('startDate')
        end_date = params.get('endDate')
        strategy = params.get('strategy')
        constraints = params.get('constraints', {})

        if not tickers or not start_date or not end_date:
            raise ValueError("tickers, startDate, and endDate are required")

        result = optimize_portfolio(tickers, start_date, end_date, strategy, constraints)
        print(json.dumps(result))  # <- stdout: send data back to TS
    except Exception as e:
        error_output = {'error': str(e), 'trace': traceback.format_exc()}
        print(json.dumps(error_output))  # Still to stdout so TS can parse
        sys.exit(1)