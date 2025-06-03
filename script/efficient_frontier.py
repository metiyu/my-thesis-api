# script/efficient_frontier.py
import numpy as np
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize
import sys
import json
import warnings
from scipy import stats

warnings.filterwarnings("ignore")

class RobustPortfolioOptimizer:
    def __init__(self, returns_data):
        self.returns = returns_data
        self.n_assets = returns_data.shape[1]

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

    def optimize_portfolio(self, objective='modified_sharpe', constraints=None, bounds=None, additional_constraints=None):
        initial_weights = np.array([1/self.n_assets] * self.n_assets)

        if bounds is None:
            bounds = [(0, 1)] * self.n_assets

        constraints_list = [{'type': 'eq', 'fun': lambda x: np.sum(x) - 1}]
        if constraints:
            if 'min_weight' in constraints:
                constraints_list.append({'type': 'ineq', 'fun': lambda x: x - constraints['min_weight']})
            if 'max_weight' in constraints:
                constraints_list.append({'type': 'ineq', 'fun': lambda x: constraints['max_weight'] - x})

        if additional_constraints:
            constraints_list.extend(additional_constraints)

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

    def calculate_portfolio_metrics(self, weights):
        portfolio_returns = self.returns @ weights
        return {
            'mean_return': float(np.mean(portfolio_returns)),
            'volatility': float(np.std(portfolio_returns)),
            'historical_var_95': float(self.calculate_historical_var(weights)),
            'historical_cvar_95': float(self.calculate_historical_cvar(weights)),
            'modified_sharpe': float(self.calculate_modified_sharpe(weights)),
            'skewness': float(stats.skew(portfolio_returns)),
            'kurtosis': float(stats.kurtosis(portfolio_returns))
        }

def generate_efficient_frontier(returns_data, n_points=100):
    optimizer = RobustPortfolioOptimizer(returns_data)
    frontier_points = []

    min_risk_weights = optimizer.optimize_portfolio(objective='min_cvar')
    max_return_weights = optimizer.optimize_portfolio(objective='modified_sharpe')

    min_return = optimizer.calculate_portfolio_metrics(min_risk_weights)['mean_return']
    max_return = optimizer.calculate_portfolio_metrics(max_return_weights)['mean_return']

    target_returns = np.linspace(min_return, max_return, n_points)

    for target in target_returns:
        target_return_constraint = [
            {'type': 'eq', 'fun': lambda x: np.mean(returns_data @ x) - target}
        ]
        weights = optimizer.optimize_portfolio(
            objective='min_cvar',
            additional_constraints=target_return_constraint,
            bounds=[(0, 1)] * returns_data.shape[1]
        )
        metrics = optimizer.calculate_portfolio_metrics(weights)
        frontier_points.append({
            'return': metrics['mean_return'],
            'risk': metrics['historical_cvar_95'],
            'weights': [float(w) for w in weights.tolist()]
        })

    return frontier_points

if __name__ == "__main__":
    try:
        tickers = json.loads(sys.argv[1])
        start_date = sys.argv[2]
        end_date = sys.argv[3]
        n_points = int(sys.argv[4])  # Number of points on the efficient frontier

        data = pd.DataFrame()
        for ticker in tickers:
            stock = yf.download(ticker, start=start_date, end=end_date)
            data[ticker] = stock['Close'].pct_change().dropna()

        if data.empty:
            print(json.dumps({"error": "No valid historical data found"}))
            sys.exit(1)

        frontier_points = generate_efficient_frontier(data, n_points)
        print(json.dumps(frontier_points))

    except Exception as e:
        print(json.dumps({"error": str(e)}))