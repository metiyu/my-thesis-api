import { Module, Global, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ApiKeyMiddleware } from './api-key.middleware';
import { ApiKeyService } from './api-key.service';

@Global()
@Module({
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('*');
  }
}