import numpy as np
import pandas as pd
import yfinance as yf
from scipy import stats
from scipy.optimize import minimize
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta

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
                    returns = stock['Adj Close'].pct_change()
                    if len(returns.dropna()) > 0:
                        data[ticker] = returns
                        valid_tickers.append(ticker)
            except Exception as e:
                print(f"Error {ticker}: {e}")
                
        data = data.dropna()
        return data, valid_tickers
    
    def analyze_individual_stocks(self, returns_data):
        metrics = pd.DataFrame()
        
        for col in returns_data.columns:
            returns = returns_data[col]
            metrics.loc[col, 'Mean Return'] = returns.mean()
            metrics.loc[col, 'Volatility'] = returns.std()
            metrics.loc[col, 'Sharpe Ratio'] = returns.mean() / returns.std()
            metrics.loc[col, 'Skewness'] = stats.skew(returns)
            metrics.loc[col, 'Kurtosis'] = stats.kurtosis(returns)
            
        return metrics.sort_values('Sharpe Ratio', ascending=False)

def run_portfolio_analysis(tickers, start_date, end_date):
    analyzer = PortfolioAnalyzer(start_date, end_date)
    
    returns_data, valid_tickers = analyzer.get_data(tickers)
    
    stock_metrics = analyzer.analyze_individual_stocks(returns_data)
    
    return {
        'returns_data': returns_data,
        'stock_metrics': stock_metrics,
    }

lq45_tickers = pd.read_csv('../my-thesis-api/script/dataset/consistent_lq45_stocks.csv')['ticker']

# Periode analisis
start_date = '2019-09-01'
end_date = '2024-09-01'

results = run_portfolio_analysis(lq45_tickers, start_date, end_date)
print(results['stock_metrics'].to_json(orient="index", indent=4))