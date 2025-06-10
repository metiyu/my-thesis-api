import { PythonService } from './python/python.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioService } from './portfolio/portfolio.service';
import { PortfolioController } from './portfolio/portfolio.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApiKeyModule } from './api-key/api-key.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { TestController } from './test/test.controller';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ApiKeyModule,
    AuthModule,
    TestModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, // 1 minute
          limit: 20, // 20 requests per minute
        },
      ],
    }),
  ],
  controllers: [AppController, PortfolioController, AuthController, TestController],
  providers: [
    PythonService,
    AppService,
    PortfolioService
  ],
})
export class AppModule { }
