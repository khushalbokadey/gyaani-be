export interface DatabaseConfig {
  uri: string;
  poolSize: number;
  timeout: number;
}

export interface ServerConfig {
  port: number;
  host: string;
  cors: {
    origin: string[];
    credentials: boolean;
  };
}

export interface SecurityConfig {
  jwtSecret: string;
  bcryptRounds: number;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

export interface LoggingConfig {
  level: string;
  format: string;
  transports: string[];
}

export interface HealthCheckConfig {
  timeout: number;
}

export interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  security: SecurityConfig;
  logging: LoggingConfig;
  healthCheck: HealthCheckConfig;
}

export const configuration = (): AppConfig => ({
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      credentials: process.env.CORS_CREDENTIALS === 'true',
    },
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gyaani-app',
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
    timeout: parseInt(process.env.DB_TIMEOUT || '30000', 10),
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    transports: process.env.LOG_TRANSPORTS?.split(',') || ['console'],
  },
  healthCheck: {
    timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT || '5000', 10),
  },
});

// Environment validation
export const validateEnvironment = (): void => {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  // Validate bcrypt rounds
  const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
  if (bcryptRounds < 10 || bcryptRounds > 15) {
    throw new Error('BCRYPT_ROUNDS must be between 10 and 15');
  }
};
