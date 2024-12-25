import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

	const config = new DocumentBuilder()
        .setTitle('Stock Market Analysis API')
        .setDescription('Stock Portfolio Optimization on LQ45 Index Using Historical VaR and Non-Parametric CVaR')
        .setVersion('1.0')
        .addTag('stocks', 'Stock market data and analysis')
        .addTag('indicators', 'Technical indicators and patterns')
        .addTag('predictions', 'Market predictions and forecasts')
        .build();

    // Add document here
    const adminDocument = SwaggerModule.createDocument(app, config, {
        include: [

        ],
    });
    SwaggerModule.setup('api/admin', app, adminDocument);
    
	const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
