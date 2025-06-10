import { MiddlewareConsumer, NestModule } from '@nestjs/common';
export declare class ApiKeyModule implements NestModule {
    private readonly logger;
    constructor();
    configure(consumer: MiddlewareConsumer): void;
}
