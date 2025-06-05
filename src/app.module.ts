import { PythonService } from './python/python.service';
import { StocksService } from './stocks/stocks.service';
import { StocksController } from './stocks/stocks.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortofolioController } from './portofolio/portofolio.controller';
import { PortofolioService } from './portofolio/portofolio.service';
import { PortfolioService } from './portfolio/portfolio.service';
import { PortfolioController } from './portfolio/portfolio.controller';

@Module({
  imports: [],
  controllers: [StocksController, AppController, PortofolioController, PortfolioController],
  providers: [
        PythonService, 
        StocksService, AppService, PortofolioService, PortfolioService],
})
export class AppModule {}
