import { PythonService } from './python/python.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioService } from './portfolio/portfolio.service';
import { PortfolioController } from './portfolio/portfolio.controller';

@Module({
  imports: [],
  controllers: [AppController, PortfolioController],
  providers: [
    PythonService,
    AppService,
    PortfolioService
  ],
})
export class AppModule { }
