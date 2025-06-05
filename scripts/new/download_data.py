import sys
import json
import pandas as pd
import yfinance as yf
import traceback
import warnings
warnings.filterwarnings("ignore", message=".*auto_adjust.*")

def download_data(tickers, start_date, end_date):
    """
    Download historical stock data from Yahoo Finance.
    Returns daily percentage change.
    """
    returns = {}
    for ticker in tickers:
        try:
            df = yf.download(ticker, start=start_date, end=end_date, auto_adjust=True, progress=False)
            if df.empty:
                print(f"No data found for {ticker}", file=sys.stderr)
                continue

            df['Return'] = df['Close'].pct_change()
            returns[ticker] = df['Return'].dropna().tolist()
        except Exception as e:
            print(f"Error downloading data for {ticker}: {e}", file=sys.stderr)
            traceback.print_exc(file=sys.stderr)

    return {'returns': returns}

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

        if not tickers or not start_date or not end_date:
            raise ValueError("tickers, startDate, and endDate are required")

        result = download_data(tickers, start_date, end_date)
        print(json.dumps(result))  # <- stdout: send data back to TS
    except Exception as e:
        error_output = {'error': str(e), 'trace': traceback.format_exc()}
        print(json.dumps(error_output))  # Still to stdout so TS can parse
        sys.exit(1)