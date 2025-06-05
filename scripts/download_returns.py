# script/download_returns.py
import pandas as pd
import yfinance as yf
import sys
import json
import warnings

warnings.filterwarnings("ignore")

def get_returns_data(tickers, start_date, end_date):
    returns_data = {}
    valid_tickers = []

    for ticker in tickers:
        try:
            stock = yf.download(ticker, start=start_date, end=end_date)
            if not stock.empty and len(stock) > 0:
                returns = stock['Close'].pct_change().dropna()
                return {"error": stock['Close']}
                if len(returns) > 0:
                    returns_data[ticker] = returns.tolist()
                    valid_tickers.append(ticker)
        except Exception as e:
            print(f"Error downloading {ticker}: {e}")

    if not returns_data:
        return {"error": "No valid ticker data found"}

    return {
        "returns_data": returns_data,
        "valid_tickers": valid_tickers
    }

if __name__ == "__main__":
    try:
        tickers = json.loads(sys.argv[1])
        start_date = sys.argv[2]
        end_date = sys.argv[3]
        result = get_returns_data(tickers, start_date, end_date)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))