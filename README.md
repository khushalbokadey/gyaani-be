# Gyaani App Backend

A comprehensive educational platform backend built with NestJS, MongoDB, and TypeScript. This backend powers the Gyaani mobile learning application, providing APIs for subject management, topic tracking, and progress monitoring.

## 🎯 Overview

Gyaani is an educational mobile application that provides structured learning experiences across multiple subjects with progress tracking, streak management, and interactive quiz functionality. This backend serves as the API layer for the React Native frontend.

## ✨ Features

### Core Features
- **User Authentication** - JWT-based authentication with email/OTP login
- **User Management** - User registration, profile management, and account verification
- **Subject Management** - Create and manage learning subjects (Mathematics, Physics, Chemistry, Biology)
- **Topic Management** - Organize topics within each subject with difficulty levels
- **Progress Tracking** - Real-time progress calculation and completion tracking
- **Topic Locking System** - Sequential learning progression with locked/unlocked topics
- **OTP System** - One-time password generation for email verification and secure login
- **RESTful API** - Clean, consistent API endpoints with proper error handling
- **MongoDB Integration** - Scalable data persistence with MongoDB Atlas
- **TypeScript Support** - Type-safe development with full TypeScript integration

### Enterprise Features
- **Health Monitoring** - Comprehensive health checks for database, memory, and system status
- **Structured Logging** - Winston-based logging with request tracking and context
- **Error Handling** - Custom error classes with centralized exception handling
- **Configuration Management** - Environment-based configuration with validation
- **API Versioning** - Consistent API response format with metadata
- **CORS Support** - Cross-origin resource sharing for frontend integration
- **Request Validation** - Input validation using class-validator decorators

### Educational Features
- **Difficulty Levels** - Easy, Medium, Hard categorization for topics
- **Study Time Estimation** - Estimated completion time for each topic
- **Lesson Tracking** - Track completed lessons and total lessons per topic
- **Question Bank** - Track total questions available for each topic
- **Progress Analytics** - Calculate and track learning progress across subjects

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript (Strict Mode)
- **Validation**: class-validator, class-transformer
- **Logging**: Winston
- **Environment**: Node.js
- **Cloud Database**: MongoDB Atlas
- **Architecture**: Layered Architecture (Presentation, Application, Domain, Infrastructure)

## 📁 Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
├── core/                  # Core application infrastructure
│   ├── config/            # Environment configuration
│   ├── health/            # Health check system
│   └── logging/           # Structured logging
├── shared/                # Shared utilities
│   ├── errors/            # Custom error classes
│   ├── filters/           # Global exception handling
│   └── interfaces/        # Common interfaces
├── users/                 # Users module
│   ├── dto/
│   │   ├── register.dto.ts
│   │   ├── login.dto.ts
│   │   ├── otp.dto.ts
│   │   └── update-user.dto.ts
│   ├── schemas/
│   │   ├── user.schema.ts
│   │   └── otp.schema.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── otp.service.ts
│   │   └── email.service.ts
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── decorators/
│   │   ├── public.decorator.ts
│   │   ├── roles.decorator.ts
│   │   └── current-user.decorator.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── users.module.ts
├── subjects/              # Subjects module
│   ├── dto/
│   │   ├── create-subject.dto.ts
│   │   └── update-subject.dto.ts
│   ├── schemas/
│   │   └── subject.schema.ts
│   ├── subjects.controller.ts
│   ├── subjects.service.ts
│   └── subjects.module.ts
└── topics/                # Topics module
    ├── dto/
    │   ├── create-topic.dto.ts
    │   └── update-topic.dto.ts
    ├── schemas/
    │   └── topic.schema.ts
    ├── topics.controller.ts
    ├── topics.service.ts
    └── topics.module.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gyaani-app-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/gyaani-app?retryWrites=true&w=majority
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   HOST=localhost
   
   # Security Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024-gyaani-app
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   BCRYPT_ROUNDS=12
   
   # Email Configuration
   EMAIL_FROM=noreply@gyaani.com
   FRONTEND_URL=http://localhost:3000
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # Logging Configuration
   LOG_LEVEL=info
   LOG_FORMAT=json
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000,http://localhost:3001
   CORS_CREDENTIALS=true
   
   # Health Check Configuration
   HEALTH_CHECK_TIMEOUT=5000
   ```

4. **Start the development server**
   ```bash
   npm run start:dev
   ```

The server will start on `http://localhost:3000` with API endpoints available at `http://localhost:3000/api`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Response Format
All API responses follow this consistent format:
```json
{
  "success": true,
  "data": [/* actual data */],
  "meta": {
    "timestamp": "2025-09-18T10:21:22.994Z",
    "requestId": "subjects_1758190882994",
    "version": "1.0.0"
  }
}
```

### Endpoints

#### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/phone + password |
| POST | `/api/auth/login/otp` | Login with OTP |
| POST | `/api/auth/request-login-otp` | Request OTP for login |
| POST | `/api/auth/verify-email` | Verify email with OTP |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/auth/change-password` | Change password (authenticated) |
| POST | `/api/auth/refresh-token` | Refresh access token |
| GET | `/api/auth/me` | Get user profile (authenticated) |

#### OTP Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/otp/request` | Request OTP |
| POST | `/api/auth/otp/verify` | Verify OTP |
| POST | `/api/auth/otp/resend` | Resend OTP |

#### Subjects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subjects` | Get all subjects with topics |
| GET | `/api/subjects/:id` | Get specific subject by ID |
| GET | `/api/subjects/:name/topics` | Get topics for a specific subject |
| POST | `/api/subjects` | Create a new subject |
| PATCH | `/api/subjects/:id` | Update a subject |
| DELETE | `/api/subjects/:id` | Delete a subject |

#### Topics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/topics` | Get all topics |
| GET | `/api/topics/:id` | Get specific topic by ID |
| POST | `/api/topics` | Create a new topic |
| PATCH | `/api/topics/:id` | Update a topic |
| DELETE | `/api/topics/:id` | Delete a topic |

#### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Application health check |
| GET | `/api/health/ready` | Readiness check |
| GET | `/api/health/live` | Liveness check |

### Sample API Calls

#### Authentication

**Register User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "Password123!",
    "phoneNumber": "+1234567890"
  }'
```

**Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@example.com",
    "password": "Password123!"
  }'
```

**Request Login OTP**
```bash
curl -X POST http://localhost:3000/api/auth/request-login-otp \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@example.com"
  }'
```

**Login with OTP**
```bash
curl -X POST http://localhost:3000/api/auth/login/otp \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@example.com",
    "otpCode": "123456"
  }'
```

**Get User Profile (Authenticated)**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Health Check
```bash
curl http://localhost:3000/api/health
```

#### Get All Subjects
```bash
curl http://localhost:3000/api/subjects
```

#### Get Mathematics Topics
```bash
curl http://localhost:3000/api/subjects/Mathematics/topics
```

#### Create a New Subject
```bash
curl -X POST http://localhost:3000/api/subjects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Computer Science",
    "color": "#6366f1",
    "description": "Learn programming and computer science concepts"
  }'
```

#### Create a New Topic
```bash
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Data Structures",
    "subjectId": "SUBJECT_ID_HERE",
    "difficulty": "Medium",
    "estimatedTime": "4h 30min",
    "totalLessons": 15,
    "totalQuestions": 45,
    "description": "Arrays, linked lists, stacks, and queues"
  }'
```

## 🔐 Authentication Flow

### User Registration & Verification
1. **Register**: User provides email, password, and personal details
2. **Email Verification**: System sends OTP to user's email
3. **OTP Verification**: User enters OTP to activate account
4. **Account Active**: User can now login and access the platform

### Login Methods
1. **Password Login**: Traditional email/phone + password authentication
2. **OTP Login**: Passwordless login using OTP sent to email/phone
3. **JWT Tokens**: Secure access and refresh tokens for API authentication

### Security Features
- **Password Hashing**: bcrypt with 12+ rounds
- **JWT Tokens**: 15-minute access tokens, 7-day refresh tokens
- **OTP System**: 6-digit codes with 10-minute expiration
- **Rate Limiting**: Prevents brute force attacks
- **Email Verification**: Required for account activation

## 📊 Data Models

### User Schema
```typescript
{
  _id: ObjectId,
  email: string,              // User email (unique)
  password: string,           // Hashed password
  firstName: string,          // User's first name
  lastName: string,           // User's last name
  phoneNumber?: string,       // Optional phone number
  role: string,               // User role (student, admin, etc.)
  status: string,             // Account status (pending, active, suspended)
  isEmailVerified: boolean,   // Email verification status
  isPhoneVerified: boolean,   // Phone verification status
  lastLoginAt?: Date,         // Last login timestamp
  preferences: {              // User preferences
    notifications: boolean,
    theme: string,
    language: string
  },
  studyStats: {               // Learning statistics
    totalStudyTime: number,
    streak: number,
    completedTopics: number,
    accuracy: number
  },
  achievements: string[],     // User achievements
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Schema
```typescript
{
  _id: ObjectId,
  identifier: string,         // Email or phone number
  code: string,              // 6-digit OTP code
  type: string,              // email_verification, login, password_reset
  status: string,            // pending, verified, expired
  expiresAt: Date,           // Expiration timestamp
  attempts: number,          // Number of verification attempts
  metadata: {                // Additional data
    ipAddress?: string,
    userAgent?: string,
    deviceId?: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Subject Schema
```typescript
{
  _id: ObjectId,
  name: string,           // Subject name (unique)
  color: string,          // Hex color code
  totalTopics: number,    // Total number of topics
  completedTopics: number, // Number of completed topics
  progress: number,       // Overall progress percentage
  description?: string,   // Subject description
  lastStudied?: string,   // Last studied timestamp
  topics: any[],         // Array of topic references
  createdAt: Date,
  updatedAt: Date
}
```

### Topic Schema
```typescript
{
  _id: ObjectId,
  name: string,              // Topic name
  subjectId: ObjectId,       // Reference to parent subject
  progress: number,          // Topic completion percentage
  difficulty: string,        // Easy, Medium, Hard
  estimatedTime: string,     // Estimated study time
  totalLessons: number,      // Total lessons in topic
  completedLessons: number,  // Completed lessons
  totalQuestions: number,    // Total questions available
  isLocked: boolean,         // Whether topic is locked
  description?: string,      // Topic description
  createdAt: Date,
  updatedAt: Date
}
```

## 🎮 Sample Data

The backend comes with pre-populated sample data:

### Subjects
- **Mathematics** (Blue) - 6 topics, 75% progress
- **Physics** (Green) - 4 topics, 45% progress  
- **Chemistry** (Purple) - 4 topics, 55% progress
- **Biology** (Orange) - 4 topics, 60% progress

### Sample Topics
Each subject contains topics with varying difficulty levels:
- **Easy Topics** - Basic concepts, shorter study time
- **Medium Topics** - Intermediate concepts, moderate study time
- **Hard Topics** - Advanced concepts, longer study time
- **Locked Topics** - Sequential progression system

## 🔧 Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debug mode

# Production
npm run build              # Build the application
npm run start:prod         # Start production server

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run test coverage
```

### Code Quality

The project follows these coding standards:
- **TypeScript** - Strict mode enabled
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **NestJS Conventions** - Following NestJS best practices

## 🚀 Deployment

### Environment Variables

For production deployment, ensure these environment variables are set:

```env
MONGODB_URI=your_production_mongodb_uri
PORT=3000
NODE_ENV=production
```

### Deployment Options

1. **Heroku**
   ```bash
   git push heroku main
   ```

2. **AWS EC2**
   - Set up EC2 instance
   - Install Node.js and PM2
   - Deploy using PM2 process manager

3. **Docker**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "run", "start:prod"]
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Testing

### Using Postman

1. **Import Collection**: Import `Gyaani_Backend_API.postman_collection.json`
2. **Set Base URL**: Collection automatically uses `http://localhost:3000/api`
3. **Test Authentication Flow**:
   - Register new user
   - Request email verification OTP
   - Verify email with OTP (check terminal for code)
   - Login with password or OTP
   - Test authenticated endpoints

### Quick Start Testing

1. **Health Check**: `GET /api/health`
2. **Register User**: `POST /api/auth/register`
3. **Request OTP**: `POST /api/auth/otp/request`
4. **Verify Email**: `POST /api/auth/verify-email` (use OTP from terminal)
5. **Login**: `POST /api/auth/login`
6. **Get Profile**: `GET /api/auth/me`

### Using curl

```bash
# Test server health
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"John","lastName":"Doe","password":"Password123!","phoneNumber":"+1234567890"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","password":"Password123!"}'

# Get all subjects
curl http://localhost:3000/api/subjects

# Get specific subject topics
curl http://localhost:3000/api/subjects/Mathematics/topics
```

### Testing Documentation

- **Complete Guide**: See `POSTMAN_TESTING_GUIDE.md` for detailed testing instructions
- **Quick Start**: See `QUICK_START_POSTMAN.md` for 5-minute setup
- **React Native Integration**: See `REACT_NATIVE_INTEGRATION.md` for mobile app integration
- **Postman Collection**: Import `Gyaani_Backend_API.postman_collection.json` for ready-to-use API tests

### Testing Files Overview

| File | Purpose |
|------|---------|
| `POSTMAN_TESTING_GUIDE.md` | Comprehensive step-by-step testing guide |
| `QUICK_START_POSTMAN.md` | 5-minute quick start for testing |
| `Gyaani_Backend_API.postman_collection.json` | Ready-to-import Postman collection |
| `REACT_NATIVE_INTEGRATION.md` | Mobile app integration guide |
| `QUICK_REFERENCE.md` | Quick reference for API changes |

## 🔧 Error Handling

### Error Response Format
All errors follow a consistent format:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Subject with ID 123 not found",
    "timestamp": "2025-09-18T10:21:22.994Z",
    "requestId": "req_1758190882994"
  },
  "meta": {
    "timestamp": "2025-09-18T10:21:22.994Z",
    "requestId": "req_1758190882994",
    "version": "1.0.0"
  }
}
```

### Error Types
- **400 Bad Request** - Validation errors, malformed requests
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists
- **500 Internal Server Error** - Server-side errors

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB Atlas connection string
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify username and password are correct

2. **Port Already in Use**
   - Change the PORT in your `.env` file
   - Kill the process using the port: `lsof -ti:3000 | xargs kill -9`

3. **TypeScript Errors**
   - Run `npm run build` to check for compilation errors
   - Ensure all dependencies are installed: `npm install`

4. **API Endpoint Not Found (404)**
   - Ensure you're using the `/api` prefix in your requests
   - Check that the server is running on the correct port
   - Verify the endpoint URL is correct

5. **CORS Errors**
   - Check your CORS_ORIGIN environment variable
   - Ensure your frontend URL is included in the allowed origins

6. **Authentication Issues**
   - Ensure JWT_SECRET is set and at least 32 characters long
   - Check that email verification is completed before login
   - Verify OTP codes from terminal logs (not email)
   - Wait 1 minute between OTP requests
   - Check token expiration (15 minutes for access tokens)

7. **OTP Not Working**
   - Check server logs for OTP codes (🔑 OTP CODE: 123456)
   - Ensure OTP hasn't expired (10 minutes)
   - Wait 1 minute between OTP requests
   - Check rate limiting settings


## 🙏 Acknowledgments

- NestJS team for the amazing framework
- MongoDB team for the database solution
- The open-source community for various packages

