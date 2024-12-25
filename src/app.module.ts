import { PythonService } from './python/python.service';
import { StocksService } from './stocks/stocks.service';
import { StocksController } from './stocks/stocks.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [StocksController, AppController],
  providers: [
        PythonService, 
        StocksService, AppService],
})
export class AppModule {}
