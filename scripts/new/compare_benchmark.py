# scripts/compare_benchmark.py

import sys
import json
import pandas as pd
import numpy as np
import yfinance as yf
import traceback
import warnings
warnings.filterwarnings("ignore", message=".*auto_adjust.*")

def calculate_equal_weighted_portfolio(returns_df):
    weights = np.ones(len(returns_df.columns)) / len(returns_df.columns)
    portfolio_returns = returns_df @ weights
    mean_return = float(portfolio_returns.mean())
    volatility = float(portfolio_returns.std())
    sharpe_ratio = mean_return / volatility if volatility != 0 else float('-inf')
    return {
        "mean_return": mean_return,
        "volatility": volatility,
        "sharpe_ratio": sharpe_ratio
    }

def compare_with_benchmark(tickers, start_date, end_date):
    returns_df = pd.DataFrame()

    for ticker in tickers:
        try:
            df = yf.download(ticker, start=start_date, end=end_date, auto_adjust=True, progress=False)['Close'].pct_change().dropna()
            if not df.empty:
                returns_df[ticker] = df
        except Exception as e:
            print(f"Error fetching data for {ticker}: {e}", file=sys.stderr)

    if returns_df.empty:
        raise ValueError("No valid historical data found")

    benchmark = calculate_equal_weighted_portfolio(returns_df)

    return {
        "benchmark_performance": benchmark
    }

if __name__ == '__main__':
    try:
        # Debug logging
        print("ARGV:", sys.argv, file=sys.stderr)
        
        if len(sys.argv) < 2:
            raise ValueError("Missing input JSON")
        
        # 🔁 Baca dari file bukan dari argv
        temp_file = sys.argv[1]
        with open(temp_file, 'r') as f:
            params = json.load(f)
        
        tickers = params.get('tickers', ["SMGR.JK","PGAS.JK","PTBA.JK","ADRO.JK","ITMG.JK","INTP.JK","INKP.JK","INDF.JK","INCO.JK","ICBP.JK","TLKM.JK","EXCL.JK","TOWR.JK","UNTR.JK","CPIN.JK","UNVR.JK","BMRI.JK","BBTN.JK","BBRI.JK","BBNI.JK","BBCA.JK","ASII.JK","ANTM.JK","KLBF.JK","MDKA.JK","BRPT.JK","TBIG.JK","MEDC.JK","ACES.JK","GGRM.JK","AKRA.JK","JPFA.JK"])
        start_date = params.get('startDate', "2019-09-01")
        end_date = params.get('endDate', "2024-09-01")
        
        # if not tickers or not start_date or not end_date:
        #     raise ValueError("tickers, startDate, and endDate are required")

        result = compare_with_benchmark(tickers, start_date, end_date)
        print(json.dumps(result, indent=2))        
    except Exception as e:
        error_output = {
            'error': str(e), 
            'trace': traceback.format_exc()
        }
        print(json.dumps(error_output), file=sys.stdout)
        sys.exit(1)