export abstract class ApplicationError extends Error {
  abstract code: string;
  abstract httpStatusCode: number;
  public timestamp: Date;
  public requestId?: string | undefined;

  constructor(message: string, requestId?: string | undefined) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.requestId = requestId;
    Error.captureStackTrace(this, this.constructor);
  }

  abstract toJson(): ErrorResponse;
}

export interface ErrorResponse {
  code: string;
  message: string;
  timestamp: string;
  requestId?: string | undefined;
  field?: string;
  details?: any;
}

export class ValidationError extends ApplicationError {
  code = 'VALIDATION_ERROR';
  httpStatusCode = 400;
  public field: string;

  constructor(message: string, field: string, requestId?: string | undefined) {
    super(message, requestId);
    this.field = field;
  }

  toJson(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      field: this.field,
      timestamp: this.timestamp.toISOString(),
      requestId: this.requestId,
    };
  }
}

export class NotFoundError extends ApplicationError {
  code = 'NOT_FOUND';
  httpStatusCode = 404;

  toJson(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      requestId: this.requestId,
    };
  }
}

export class ConflictError extends ApplicationError {
  code = 'CONFLICT';
  httpStatusCode = 409;

  toJson(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      requestId: this.requestId,
    };
  }
}

export class InternalServerError extends ApplicationError {
  code = 'INTERNAL_SERVER_ERROR';
  httpStatusCode = 500;

  toJson(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      requestId: this.requestId,
    };
  }
}
