import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

export interface LogContext {
  requestId?: string;
  userId?: string;
  endpoint?: string;
  method?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'gyaani-app-backend' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
    });
  }

  log(message: string, context?: LogContext): void {
    this.logger.info(message, context);
  }

  error(message: string, trace?: string, context?: LogContext): void {
    this.logger.error(message, { trace, ...context });
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: LogContext): void {
    this.logger.verbose(message, context);
  }

  // Custom methods for structured logging
  logRequest(method: string, url: string, context?: LogContext): void {
    this.log(`Request: ${method} ${url}`, context);
  }

  logResponse(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    context?: LogContext,
  ): void {
    this.log(`Response: ${method} ${url} ${statusCode} - ${duration}ms`, {
      ...context,
      duration,
    });
  }

  logError(error: Error, context?: LogContext): void {
    this.error(error.message, error.stack, context);
  }
}
