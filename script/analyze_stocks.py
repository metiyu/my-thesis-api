# script/analyze_stocks.py
import pandas as pd
import yfinance as yf
from scipy import stats
import sys
import json
import warnings

warnings.filterwarnings("ignore")


def analyze_individual_stocks(tickers, start_date, end_date, metrics):
    # --- Validasi tanggal ---
    if pd.to_datetime(start_date) > pd.to_datetime(end_date):
        return {"error": "Start date cannot be after end date."}

    data = pd.DataFrame()
    valid_tickers = []

    for ticker in tickers:
        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                stock = yf.download(ticker, start=start_date, end=end_date)
            if not stock.empty and len(stock) > 0:
                returns = stock['Close'].pct_change()
                if len(returns.dropna()) > 0:
                    data[ticker] = returns
                    valid_tickers.append(ticker)
        except Exception as e:
            print(f"Error downloading {ticker}: {e}")

    if data.empty:
        return {"error": "No valid ticker data found. Please check ticker symbols or date range."}

    data = data.dropna()
    metrics_results = {}

    for col in data.columns:
        returns = data[col].dropna()

        if returns.empty:
            continue

        metrics_results[col] = {
            'Mean Return': float(returns.mean()),
            'Volatility': float(returns.std()),
            'Sharpe Ratio': float(returns.mean() / returns.std()) if returns.std() != 0 else None,
            'Skewness': float(stats.skew(returns)),
            'Kurtosis': float(stats.kurtosis(returns))
        }

    # --- Filter metrics jika diminta ---
    if metrics:
        invalid_metrics = [m for m in metrics if m not in next(iter(metrics_results.values())).keys()]
        if invalid_metrics:
            return {"error": f"Invalid metrics requested: {invalid_metrics}"}
        for ticker in metrics_results:
            metrics_results[ticker] = {m: metrics_results[ticker][m] for m in metrics}

    return metrics_results


if __name__ == "__main__":
    try:
        tickers = json.loads(sys.argv[1])
        start_date = sys.argv[2]
        end_date = sys.argv[3]
        metrics = json.loads(sys.argv[4])

        result = analyze_individual_stocks(tickers, start_date, end_date, metrics)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))