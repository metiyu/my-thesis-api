import pandas as pd
from datetime import datetime
import yfinance as yf
import os
import json
from curl_cffi import requests

class LQ45Analyzer:
    def __init__(self, lq45_compositions):
        self.df = pd.DataFrame(lq45_compositions, columns=[
            'period', 'stock_code', 'start_date', 'end_date'
        ])
        self.session = requests.Session(impersonate="chrome")
        
    def get_consistent_stocks(self, min_consistency=0.7):
        today = datetime.today().strftime('%Y-%m-%d')
        start_date = '2020-02-03'

        stock_frequency = self.df['stock_code'].value_counts()
        total_periods = len(self.df['period'].unique())
        
        consistent_stocks = stock_frequency[stock_frequency / total_periods >= min_consistency]
        consistent_stock_codes = consistent_stocks.index.tolist()
        
        valid_stocks = []
        tickers = []
        for stock in consistent_stock_codes:
            try:
                data = yf.download(stock + '.JK', start=start_date, end=today, progress=False, session=self.session)
                if not data.empty:
                    valid_stocks.append(stock)
                    tickers.append(stock + '.JK')
            except Exception as e:
                print(f"Error fetching data for {stock}: {e}")
        
        if not valid_stocks:
            return {"error": "No consistent stocks found with valid Yahoo Finance data"}
        
        consistency_df = pd.DataFrame({
            'stock_code': valid_stocks,
            'consistency': [consistent_stocks[stock] / total_periods for stock in valid_stocks],
            'ticker': tickers
        })
        
        return consistency_df.to_dict(orient='records')

if __name__ == "__main__":
    # Pastikan path benar relatif ke direktori saat script dijalankan
    current_dir = os.path.dirname(os.path.abspath(__file__))
    summary_path = os.path.join(current_dir, 'dataset', 'summary.csv')

    try:
        summary_df = pd.read_csv(summary_path)
    except FileNotFoundError:
        print(json.dumps({"error": f"File not found: {summary_path}"}))
        exit()

    lq45_compositions = summary_df.to_dict(orient='records')
    analyzer = LQ45Analyzer(lq45_compositions)
    result = analyzer.get_consistent_stocks()

    print(json.dumps(result, indent=None))  # Hindari indent untuk JSON valid