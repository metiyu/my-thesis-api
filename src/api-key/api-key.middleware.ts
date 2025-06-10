import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from './api-key.service';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
    private readonly logger = new Logger(ApiKeyMiddleware.name);

    constructor(private readonly apiKeyService: ApiKeyService) {
        this.logger.log('[ApiKeyMiddleware] Constructor called');
    }

    async use(req: Request, res: Response, next: NextFunction) {
        // Log EVERY request to make sure middleware is working
        this.logger.log(`[ApiKeyMiddleware] ===== MIDDLEWARE TRIGGERED =====`);
        this.logger.log(`[ApiKeyMiddleware] ${req.method} ${req.url}`);
        this.logger.log(`[ApiKeyMiddleware] Path: ${req.path}`);
        this.logger.log(`[ApiKeyMiddleware] Headers: ${JSON.stringify(req.headers, null, 2)}`);

        // Define routes that should skip API key check
        const skipPaths = [
            '/',
            '/auth/get-key-form',
            '/auth/generate-key',
            '/favicon.ico',
        ];

        // Check for static file requests (CSS, JS, images, etc.)
        const isStaticFile = req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i);

        const currentPath = req.path;
        const shouldSkip = skipPaths.includes(currentPath) || !!isStaticFile;

        this.logger.log(`[ApiKeyMiddleware] Should skip: ${shouldSkip} (Static file: ${!!isStaticFile})`);

        if (shouldSkip) {
            this.logger.log(`[ApiKeyMiddleware] SKIPPING - calling next()`);
            return next();
        }

        this.logger.log(`[ApiKeyMiddleware] CHECKING API KEY...`);

        // Wait for service to be ready
        await this.apiKeyService.ensureReady();

        // Check API key in header or cookie
        const apiKeyFromHeader = req.headers['x-api-key'] as string;
        const apiKeyFromCookie = req.cookies?.['x-api-key'];
        const apiKey = apiKeyFromHeader || apiKeyFromCookie;

        this.logger.log(`[ApiKeyMiddleware] API Key found - Header: ${!!apiKeyFromHeader}, Cookie: ${!!apiKeyFromCookie}`);
        this.logger.log(`[ApiKeyMiddleware] Cookies received: ${JSON.stringify(req.cookies)}`);

        if (!apiKey || typeof apiKey !== 'string') {
            this.logger.log('[ApiKeyMiddleware] NO API KEY - REDIRECTING TO FORM');
            return res.redirect('/auth/get-key-form');
        }

        const isValid = await this.apiKeyService.isValidApiKey(apiKey);
        if (!isValid) {
            this.logger.log('[ApiKeyMiddleware] INVALID API KEY - REDIRECTING TO FORM');
            res.clearCookie('x-api-key');
            return res.redirect('/auth/get-key-form');
        }

        this.logger.log('[ApiKeyMiddleware] VALID API KEY - PROCEEDING');
        next();
    }
}