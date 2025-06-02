import numpy as np
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize

class RobustPortfolioOptimizer:
    def __init__(self, returns_data):
        self.returns = returns_data
        self.n_assets = returns_data.shape[1]

    def calculate_historical_cvar(self, weights, confidence_level=0.95):
        portfolio_returns = self.returns @ weights
        var = -np.percentile(portfolio_returns, (1 - confidence_level) * 100)
        return -np.mean(portfolio_returns[portfolio_returns <= -var])

    def optimize_portfolio(self, objective='modified_sharpe', constraints=None, bounds=None):
        initial_weights = np.array([1/self.n_assets] * self.n_assets)

        if bounds is None:
            bounds = [(0, 1) for _ in range(self.n_assets)]

        constraints_list = [{'type': 'eq', 'fun': lambda x: np.sum(x) - 1}]

        if constraints:
            if 'min_weight' in constraints:
                constraints_list.append({'type': 'ineq', 'fun': lambda x: x - constraints['min_weight']})
            if 'max_weight' in constraints:
                constraints_list.append({'type': 'ineq', 'fun': lambda x: constraints['max_weight'] - x})

        if objective == 'modified_sharpe':
            objective_function = lambda x: -self.calculate_modified_sharpe(x)
        elif objective == 'min_cvar':
            objective_function = lambda x: self.calculate_historical_cvar(x)
        elif objective == 'mean_cvar':
            def objective_function(x):
                returns = np.mean(self.returns @ x)
                cvar = self.calculate_historical_cvar(x)
                return -(returns - 0.5 * cvar)

        result = minimize(objective_function, initial_weights, method='SLSQP', bounds=bounds, constraints=constraints_list)
        return result.x

    def calculate_modified_sharpe(self, weights):
        portfolio_returns = self.returns @ weights
        mean_return = np.mean(portfolio_returns)
        cvar = self.calculate_historical_cvar(weights)
        return mean_return / cvar if cvar != 0 else -np.inf

if __name__ == "__main__":
    import sys
    import json

    tickers = json.loads(sys.argv[1])
    start_date = sys.argv[2]
    end_date = sys.argv[3]
    strategy = sys.argv[4]
    constraints = json.loads(sys.argv[5])

    data = pd.DataFrame()
    for ticker in tickers:
        stock = yf.download(ticker, start=start_date, end=end_date)
        data[ticker] = stock['Close'].pct_change().dropna()

    optimizer = RobustPortfolioOptimizer(data)
    weights = optimizer.optimize_portfolio(objective=strategy, constraints=constraints)
    print(json.dumps(weights.tolist()))