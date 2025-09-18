import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { configuration } from './config/configuration';
import { LoggerService } from './logging/logger.service';
import { HealthCheckService } from './health/health-check.service';
import { HealthCheckController } from './health/health-check.controller';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gyaani-app',
        retryWrites: true,
        w: 'majority',
      }),
    }),
  ],
  providers: [LoggerService, HealthCheckService],
  controllers: [HealthCheckController],
  exports: [LoggerService, HealthCheckService],
})
export class CoreModule {}
