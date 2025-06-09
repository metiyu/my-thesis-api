import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from './api-key.service';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
    constructor(private readonly apiKeyService: ApiKeyService) { }

    use(req: Request, res: Response, next: NextFunction) {
        const skipPaths = ['/auth/get-key-form', '/auth/generate-key', '/api-json', '/api/swagger-ui'];

        if (skipPaths.some(path => req.url.startsWith(path))) {
            return next();
        }

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