#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Gyaani Backend Setup Script');
console.log('================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('📝 Creating .env file from template...');
  
  // Create .env file with default values
  const envContent = `# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority&appName=Cluster0

# Server Configuration
PORT=3000
NODE_ENV=development
HOST=localhost

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true

# JWT Configuration
JWT_SECRET=${crypto.randomBytes(32).toString('hex')}
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Password Hashing
BCRYPT_ROUNDS=12

# Email Configuration
EMAIL_FROM=noreply@gyaani.com
FRONTEND_URL=http://localhost:3000

# Database Pool Configuration
DB_POOL_SIZE=10
DB_TIMEOUT=30000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=json
LOG_TRANSPORTS=console,file

# Health Check Configuration
HEALTH_CHECK_TIMEOUT=5000

# OTP Configuration
OTP_EXPIRES_IN=600000
OTP_MAX_ATTEMPTS=3
OTP_LENGTH=6

# Security Configuration
SESSION_SECRET=${crypto.randomBytes(32).toString('hex')}
COOKIE_SECRET=${crypto.randomBytes(32).toString('hex')}
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully');
}

// Check if node_modules exists
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('✅ Dependencies already installed');
} else {
  console.log('📦 Installing dependencies...');
  console.log('   Run: npm install');
}

// Check if logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
  console.log('✅ Created logs directory');
}

console.log('\n🎉 Setup Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Update MONGODB_URI in .env file with your MongoDB connection string');
console.log('2. Run: npm install (if not already done)');
console.log('3. Run: npm run start:dev');
console.log('\n🔗 API will be available at: http://localhost:3000/api');
console.log('📊 Health check: http://localhost:3000/api/health');
console.log('\n📚 Documentation:');
console.log('- README.md - Complete API documentation');
console.log('- ENVIRONMENT_SETUP.md - Environment configuration guide');
console.log('\n🔐 Security Notes:');
console.log('- JWT_SECRET has been auto-generated (32 characters)');
console.log('- Change all secrets in production');
console.log('- Never commit .env file to version control');
