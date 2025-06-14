import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { join } from 'path';
import { json, Request, Response } from 'express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Security - Relaxed CSP for Swagger UI
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
                imgSrc: ["'self'", "data:", "https:"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
            },
        },
    }));

    // CORS - Allow all origins since it's an API service
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    });

    // Middleware
    app.use(cookieParser());
    app.use(json({ limit: '50mb' }));
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // Static files
    app.useStaticAssets(join(__dirname, '..', 'public'), {
        prefix: '/public/',
    });

    // Health check
    app.getHttpAdapter().get('/health', (req: Request, res: Response) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
        });
    });

    // Root redirect
    app.getHttpAdapter().get('/', (req: Request, res: Response) => {
        res.redirect('/api');
    });

    // Swagger setup
    const config = new DocumentBuilder()
        .setTitle('My Thesis API')
        .setDescription('Portfolio optimization API with Python-powered analytics')
        .setVersion('1.0')
        .addServer('/', 'Production server')
        .addApiKey({
            type: 'apiKey',
            name: 'x-api-key',
            in: 'header',
            description: 'API key for authentication'
        }, 'api-key')
        .addTag('Portfolio', 'Portfolio optimization endpoints')
        .addTag('Auth', 'Authentication endpoints')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'My Thesis API Documentation',
        customfavIcon: '/public/favicon.ico',
        customCss: `
            .swagger-ui .topbar { display: none }
            .swagger-ui .info .title { color: #2c3e50; }
        `,
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
        },
    });

    // Port and host
    const port = process.env.PORT || 3000;

    // Bind to 0.0.0.0 for external access
    await app.listen(port, '0.0.0.0');

    // Show dynamic URL
    const url = process.env.REPL_SLUG
        ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
        : `http://localhost:${port}`;

    console.log(`🚀 Application is running on: ${url}`);
    console.log(`📚 API Documentation: ${url}/api`);
    console.log(`🔑 API Key Form: ${url}/auth/get-key-form`);
    console.log(`📊 Health Check: ${url}/health`);
}

bootstrap().catch((error) => {
    console.error('❌ Error starting the application:', error);
    process.exit(1);
});