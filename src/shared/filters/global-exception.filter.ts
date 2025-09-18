import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationError } from '../errors/application.error';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = request.headers['x-request-id'] as string || 
                     request.headers['x-correlation-id'] as string || 
                     this.generateRequestId();

    let status: number;
    let errorResponse: ApiResponse<null>;

    if (exception instanceof ApplicationError) {
      status = exception.httpStatusCode;
      errorResponse = {
        success: false,
        error: exception.toJson(),
        meta: {
          timestamp: new Date().toISOString(),
          requestId,
          version: '1.0.0',
        },
      };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      errorResponse = {
        success: false,
        error: {
          code: 'HTTP_EXCEPTION',
          message: typeof exceptionResponse === 'string' 
            ? exceptionResponse 
            : (exceptionResponse as any).message || 'An error occurred',
          details: typeof exceptionResponse === 'object' ? exceptionResponse : undefined,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId,
          version: '1.0.0',
        },
      };
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId,
          version: '1.0.0',
        },
      };
    }

    // Log the error
    this.logger.error(
      `Error ${status}: ${errorResponse.error?.message}`,
      {
        requestId,
        method: request.method,
        url: request.url,
        userAgent: request.get('User-Agent'),
        ip: request.ip,
        stack: exception instanceof Error ? exception.stack : undefined,
      }
    );

    response.status(status).json(errorResponse);
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
