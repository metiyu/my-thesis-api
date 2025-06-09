import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import { Request, Response } from 'express';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(json({ limit: '50mb' }));

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        skipMissingProperties: false,
    }));

    // Parse cookies
    app.use(cookieParser());

    // Serve static files
    // app.use('/static', express.static(join(__dirname, '..', 'public')));
    app.use(express.static(join(__dirname, '..', 'public')));

    const config = new DocumentBuilder()
        .setTitle('Stock Market Analysis API')
        .setDescription('Stock Portfolio Optimization on LQ45 Index Using Historical VaR and Non-Parametric CVaR')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
