import { PythonService } from './python/python.service';
import { StocksService } from './stocks/stocks.service';
import { StocksController } from './stocks/stocks.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortofolioController } from './portofolio/portofolio.controller';
import { PortofolioService } from './portofolio/portofolio.service';

@Module({
  imports: [],
  controllers: [StocksController, AppController, PortofolioController],
  providers: [
        PythonService, 
        StocksService, AppService, PortofolioService],
})
export class AppModule {}
