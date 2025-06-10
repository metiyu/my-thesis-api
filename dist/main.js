"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cookieParser = require("cookie-parser");
const helmet_1 = require("helmet");
const path_1 = require("path");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
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
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    });
    app.use(cookieParser());
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'), {
        prefix: '/public/',
    });
    app.getHttpAdapter().get('/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
        });
    });
    app.getHttpAdapter().get('/', (req, res) => {
        res.redirect('/api');
    });
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
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
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
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
//# sourceMappingURL=main.js.map