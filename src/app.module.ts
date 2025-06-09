import { PythonService } from './python/python.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioService } from './portfolio/portfolio.service';
import { PortfolioController } from './portfolio/portfolio.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApiKeyModule } from './api-key/api-key.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, // 1 minute
          limit: 20, // 20 requests per minute
        },
      ],
    }),
    ApiKeyModule,
  ],
  controllers: [AppController, PortfolioController, AuthController],
  providers: [
    PythonService,
    AppService,
    PortfolioService
  ],
})
export class AppModule { }
