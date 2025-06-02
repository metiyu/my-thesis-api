import numpy as np
import pandas as pd
import yfinance as yf
from scipy import stats
import json
import sys
import ast

class PortfolioAnalyzer:
    def __init__(self, start_date, end_date):
        self.start_date = start_date
        self.end_date = end_date

    def get_data(self, tickers):
        data = pd.DataFrame()
        valid_tickers = []

        for ticker in tickers:
            try:
                stock = yf.download(ticker, start=self.start_date, end=self.end_date)
                if not stock.empty and len(stock) > 0:
                    returns = stock['Close'].pct_change()
                    if len(returns.dropna()) > 0:
                        data[ticker] = returns
                        valid_tickers.append(ticker)
            except Exception as e:
                print(f"Error {ticker}: {e}", file=sys.stderr)  # Print errors to stderr

        data = data.dropna()
        return data, valid_tickers

    def analyze_individual_stocks(self, returns_data):
        metrics = []

        for col in returns_data.columns:
            returns = returns_data[col]
            mean_return = returns.mean()
            volatility = returns.std()
            sharpe_ratio = mean_return / volatility if volatility != 0 else np.nan
            skewness = stats.skew(returns)
            kurtosis = stats.kurtosis(returns)

            metrics.append({
                "ticker": col,
                "Mean Return": float(mean_return),  # Convert to Python float
                "Volatility": float(volatility),
                "Sharpe Ratio": float(sharpe_ratio) if not np.isnan(sharpe_ratio) else None,
                "Skewness": float(skewness),
                "Kurtosis": float(kurtosis)
            })

        return metrics

def run_portfolio_analysis(tickers, start_date, end_date):
    print(tickers)
    analyzer = PortfolioAnalyzer(start_date, end_date)
    returns_data, valid_tickers = analyzer.get_data(tickers)
    stock_metrics = analyzer.analyze_individual_stocks(returns_data)
    return {
        'stock_metrics': stock_metrics,
    }

# Parse command line arguments
if len(sys.argv) >= 4:
    # Parse the ticker list from string representation
    tickers_str = sys.argv[1]
    try:
        tickers = ast.literal_eval(tickers_str)  # Safely parse the list string
    except:
        tickers = [tickers_str]  # If it's just a single ticker
    
    start_date = sys.argv[2]
    end_date = sys.argv[3]
else:
    # Fallback to default values
    lq45_tickers = pd.read_csv('./dataset/consistent_lq45_stocks.csv')['ticker']
    tickers = lq45_tickers.tolist()
    start_date = '2019-09-01'
    end_date = '2024-09-01'

results = run_portfolio_analysis(tickers, start_date, end_date)
print(json.dumps(results['stock_metrics'], indent=4))