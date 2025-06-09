import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiKeyService } from 'src/api-key/api-key.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly apiKeyService: ApiKeyService) { }

    @Post('generate-key')
    async generateKey(
        @Body('email') email: string,
        @Res() res: Response,
    ) {
        if (!this.isValidEmail(email)) {
            return res.status(HttpStatus.BAD_REQUEST).send('Invalid email');
        }

        const apiKey = this.apiKeyService.generateOrGetApiKey(email);

        // Set cookie with 7-day expiry
        res.cookie('x-api-key', apiKey, {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            httpOnly: false,
            secure: false,
        });

        return res.redirect(`/api?api_key=${apiKey}`);
    }

    @Get('get-key-form')
    getKeyForm(@Res() res: Response) {
        return res.sendFile('api-key-form.html', { root: 'public' });
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
