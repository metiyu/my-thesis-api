import { Module, Global, MiddlewareConsumer, NestModule, RequestMethod, Logger } from '@nestjs/common';
import { ApiKeyMiddleware } from './api-key.middleware';
import { ApiKeyService } from './api-key.service';

@Global()
@Module({
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule implements NestModule {
  private readonly logger = new Logger(ApiKeyModule.name);

  constructor() {
    this.logger.log('[ApiKeyModule] Constructor called');
  }

  configure(consumer: MiddlewareConsumer) {
    this.logger.log('[ApiKeyModule] Configuring middleware...');

    // Apply middleware to ALL routes
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    this.logger.log('[ApiKeyModule] Middleware configured for all routes');
  }
}