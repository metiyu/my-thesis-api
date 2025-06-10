import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import { Request, Response } from 'express';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { ApiKeyService } from './api-key/api-key.service';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);

    // Apply global middleware BEFORE other configurations
    app.use(json({ limit: '50mb' }));
    app.use(cookieParser()); // Cookie parser MUST be before your middleware

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        skipMissingProperties: false,
    }));

    // Serve static files
    app.use(express.static(join(__dirname, '..', 'public')));

    // Get the API key service to validate keys for Swagger
    const apiKeyService = app.get(ApiKeyService);
    await apiKeyService.ensureReady();

    // Custom middleware to protect Swagger routes
    app.use('/api*', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        logger.log(`[SwaggerProtection] Protecting Swagger route: ${req.url}`);

        // Check API key in header or cookie
        const apiKeyFromHeader = req.headers['x-api-key'] as string;
        const apiKeyFromCookie = req.cookies?.['x-api-key'];
        const apiKey = apiKeyFromHeader || apiKeyFromCookie;

        logger.log(`[SwaggerProtection] API Key check - Header: ${!!apiKeyFromHeader}, Cookie: ${!!apiKeyFromCookie}`);

        if (!apiKey || typeof apiKey !== 'string') {
            logger.log('[SwaggerProtection] No API key found, redirecting to form');
            return res.redirect('/auth/get-key-form');
        }

        const isValid = await apiKeyService.isValidApiKey(apiKey);
        if (!isValid) {
            logger.log('[SwaggerProtection] Invalid API key, redirecting to form');
            res.clearCookie('x-api-key');
            return res.redirect('/auth/get-key-form');
        }

        logger.log('[SwaggerProtection] Valid API key, allowing access to Swagger');
        next();
    });

    // Setup Swagger AFTER protection middleware
    const config = new DocumentBuilder()
        .setTitle('Stock Market Analysis API')
        .setDescription('Stock Portfolio Optimization on LQ45 Index Using Historical VaR and Non-Parametric CVaR')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();