import pandas as pd
from datetime import datetime, timedelta
import yfinance as yf

class LQ45Analyzer:
    def __init__(self, lq45_compositions):
        """
        Inisialisasi analyzer dengan data komposisi LQ45
        
        Parameters:
        - lq45_compositions (list): Daftar komposisi LQ45 dalam periode tertentu
        """
        self.df = pd.DataFrame(lq45_compositions, columns=[
            'period', 'stock_code', 'start_date', 'end_date'
        ])
        
    def get_consistent_stocks(self, min_consistency=0.7):
        """
        Identifikasi saham yang konsisten dalam indeks LQ45
        
        Parameters:
        - min_consistency (float): Persentase minimum keberadaan di indeks
        
        Returns:
        - DataFrame berisi saham-saham yang konsisten
        """
        today = datetime.today().strftime('%Y-%m-%d')
        start_date = '2020-02-03'
        
        # Calculate consistency for each stock
        stock_frequency = self.df['stock_code'].value_counts()
        total_periods = len(self.df['period'].unique())
        
        # Filter stocks by consistency
        consistent_stocks = stock_frequency[stock_frequency / total_periods >= min_consistency]
        consistent_stock_codes = consistent_stocks.index.tolist()
        
        # Check data availability on Yahoo Finance
        valid_stocks = []
        tickers = []
        for stock in consistent_stock_codes:
            try:
                data = yf.download(stock + '.JK', start=start_date, end=today, progress=False)
                if not data.empty:
                    valid_stocks.append(stock)
                    tickers.append(stock + '.JK')
            except Exception as e:
                print(f"Error fetching data for {stock}: {e}")
        
        # Create DataFrame with valid stocks and consistency
        consistency_df = pd.DataFrame({
            'stock_code': valid_stocks,
            'consistency': [consistent_stocks[stock] / total_periods for stock in valid_stocks],
            'ticker': tickers
        })
        
        return consistency_df
    
    def export_consistent_stocks(self, output_file='./dataset/consistent_lq45_stocks.csv', min_consistency=0.7):
        """
        Ekspor daftar saham konsisten dengan pengecekan data Yahoo Finance
        
        Parameters:
        - output_file (str): Nama file output
        - min_consistency (float): Persentase minimum keberadaan di indeks untuk dianggap konsisten
        """
        consistency_df = self.get_consistent_stocks(min_consistency)
        
        # Export to CSV
        consistency_df.to_csv(output_file, index=False)
        print(f"Exported {len(consistency_df)} consistent stocks with valid data to {output_file}")

# Contoh penggunaan
summary_df = pd.read_csv('../my-thesis-api/script/dataset/summary.csv')
lq45_compositions = summary_df.to_dict(orient='records')

analyzer = LQ45Analyzer(lq45_compositions)
consistent_stocks = analyzer.get_consistent_stocks()
# analyzer.export_consistent_stocks(output_file="../my-thesis-api/script/dataset/consistent_lq45_stocks.csv")

print(consistent_stocks.to_json(orient="records", indent=4))