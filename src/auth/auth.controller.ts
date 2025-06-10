import { Body, Controller, Get, HttpStatus, Logger, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiKeyService } from 'src/api-key/api-key.service';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly apiKeyService: ApiKeyService) { }

    @Post('generate-key')
    async generateKey(
        @Body('email') email: string,
        @Res() res: Response,
    ) {
        this.logger.log(`[AuthController] Generate key request for email: ${email}`);

        if (!email || !this.isValidEmail(email)) {
            this.logger.log(`[AuthController] Invalid email provided: ${email}`);
            return res.status(HttpStatus.BAD_REQUEST).send('Invalid or missing email');
        }

        try {
            const apiKey = await this.apiKeyService.generateOrGetApiKey(email);

            // Set cookie with 7-day expiry
            res.cookie('x-api-key', apiKey, {
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            this.logger.log(`[AuthController] API key set in cookie, redirecting to /api`);
            return res.redirect('/api');
        } catch (error) {
            this.logger.error('[AuthController] Error generating API key:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Failed to generate API key');
        }
    }

    @Get('get-key-form')
    getKeyForm(@Req() req: Request, @Res() res: Response) {
        // Check API key in header or cookie
        const apiKeyFromHeader = req.headers['x-api-key'] as string;
        const apiKeyFromCookie = req.cookies?.['x-api-key'];
        const apiKey = apiKeyFromHeader || apiKeyFromCookie;

        if (apiKey) {
            this.logger.log('[AuthController] User already has API key, redirecting to /api');
            return res.redirect('/api');
        }

        this.logger.log('[AuthController] Serving API key form');
        return res.sendFile('api-key-form.html', { root: 'public' });
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}