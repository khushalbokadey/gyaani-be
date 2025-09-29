import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerService } from './core/logging/logger.service';
import { validateEnvironment } from './core/config/configuration';

async function bootstrap() {
  // Validate environment variables
  try {
    validateEnvironment();
  } catch (error) {
    console.error(
      'Environment validation failed:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(`Health check available at: http://localhost:${port}/api/health`);
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`JWT Secret configured: ${process.env.JWT_SECRET ? 'Yes' : 'No'}`);
  logger.log(
    `Database URI configured: ${process.env.MONGODB_URI ? 'Yes' : 'No'}`,
  );
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Error starting application', error);
  process.exit(1);
});
