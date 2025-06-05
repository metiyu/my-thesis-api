# scripts/analyze_individual_stocks.py

# script/analyze_stocks.py
import pandas as pd
import yfinance as yf
from scipy import stats
import sys
import json
import warnings
import traceback

warnings.filterwarnings("ignore")


def analyze_individual_stocks(tickers, start_date, end_date):
    # --- Validasi tanggal ---
    if pd.to_datetime(start_date) > pd.to_datetime(end_date):
        return {"error": "Start date cannot be after end date."}

    data = pd.DataFrame()
    valid_tickers = []

    for ticker in tickers:
        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                stock = yf.download(ticker, start=start_date, end=end_date, auto_adjust=True, progress=False)
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
            'mean_return': float(returns.mean()),
            'volatility': float(returns.std()),
            'sharpe_ratio': float(returns.mean() / returns.std()) if returns.std() != 0 else None,
            'skewness': float(stats.skew(returns)),
            'kurtosis': float(stats.kurtosis(returns))
        }

    # --- Filter metrics jika diminta ---
    # if metrics:
    #     invalid_metrics = [m for m in metrics if m not in next(iter(metrics_results.values())).keys()]
    #     if invalid_metrics:
    #         return {"error": f"Invalid metrics requested: {invalid_metrics}"}
    #     for ticker in metrics_results:
    #         metrics_results[ticker] = {m: metrics_results[ticker][m] for m in metrics}

    return metrics_results

if __name__ == "__main__":
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

        if not tickers or not start_date or not end_date:
            raise ValueError("tickers, startDate, and endDate are required")

        result = analyze_individual_stocks(tickers, start_date, end_date)
        print(json.dumps(result))  # <- stdout: send data back to TS
    except Exception as e:
        error_output = {'error': str(e), 'trace': traceback.format_exc()}
        print(json.dumps(error_output))  # Still to stdout so TS can parse
        sys.exit(1)