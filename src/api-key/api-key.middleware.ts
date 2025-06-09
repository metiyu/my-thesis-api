import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from './api-key.service';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
    constructor(private readonly apiKeyService: ApiKeyService) {
        console.log('[ApiKeyMiddleware] Constructor called');
        if (!apiKeyService) {
            console.error('[ApiKeyMiddleware] apiKeyService is undefined!');
        }
    }

    use(req: Request, res: Response, next: NextFunction) {
        
        // Define routes that should skip API key check
        const skipPaths = [
            '/',
            '/auth/get-key-form',
            '/auth/generate-key',
            '/api-json',
            '/api/swagger-ui',
        ];

        // Better matching logic
        const shouldSkip = skipPaths.some(path =>
            req.url === path || req.url.startsWith(`${path}?`) || req.url.startsWith(`${path}/`)
        );

        console.log(`[ApiKeyMiddleware] URL: ${req.url}, Skipping: ${shouldSkip}`);

        if (shouldSkip) {
            return next();
        }

        // Check API key in header or cookie
        const apiKeyFromHeader = req.headers['x-api-key'] as string;
        const apiKeyFromCookie = req.cookies?.['x-api-key'];

        const apiKey = apiKeyFromHeader || apiKeyFromCookie;

        if (!apiKey || typeof apiKey !== 'string') {
            return res.redirect('/auth/get-key-form');
        }

        if (!this.apiKeyService.isValidApiKey(apiKey)) {
            return res.status(403).json({ error: 'Invalid API key' });
        }

        next();
    }
}