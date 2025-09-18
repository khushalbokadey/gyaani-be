# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

### Database Configuration
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority&appName=Cluster0
```

### Server Configuration
```env
PORT=3000
NODE_ENV=development
HOST=localhost
```

### CORS Configuration
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true
```

### JWT Configuration (REQUIRED)
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Password Hashing
```env
BCRYPT_ROUNDS=12
```

### Email Configuration
```env
EMAIL_FROM=noreply@gyaani.com
FRONTEND_URL=http://localhost:3000
```

### Database Pool Configuration
```env
DB_POOL_SIZE=10
DB_TIMEOUT=30000
```

### Rate Limiting
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Logging Configuration
```env
LOG_LEVEL=info
LOG_FORMAT=json
LOG_TRANSPORTS=console,file
```

### Health Check Configuration
```env
HEALTH_CHECK_TIMEOUT=5000
```

### OTP Configuration
```env
OTP_EXPIRES_IN=600000
OTP_MAX_ATTEMPTS=3
OTP_LENGTH=6
```

### Security Configuration
```env
SESSION_SECRET=your-session-secret-key-change-in-production
COOKIE_SECRET=your-cookie-secret-key-change-in-production
```

## Security Notes

1. **JWT_SECRET**: Must be at least 32 characters long
2. **BCRYPT_ROUNDS**: Should be between 10-15 for security vs performance balance
3. **Never commit .env files** to version control
4. **Use different secrets** for different environments (development, staging, production)

## Quick Setup

1. Copy the environment variables above to a `.env` file
2. Update the `MONGODB_URI` with your actual MongoDB connection string
3. Generate a strong JWT_SECRET (at least 32 characters)
4. Run `npm run start:dev` to start the server

## Environment Validation

The application will validate required environment variables on startup and show helpful error messages if any are missing or invalid.

## Production Considerations

- Use strong, unique secrets for production
- Set `NODE_ENV=production`
- Use a proper email service (SendGrid, AWS SES, etc.)
- Configure proper CORS origins
- Set up proper logging and monitoring
- Use environment-specific database connections
