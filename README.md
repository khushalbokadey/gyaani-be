# Gyaani App Backend

A comprehensive educational platform backend built with NestJS, MongoDB, and TypeScript. This backend powers the Gyaani mobile learning application, providing APIs for subject management, topic tracking, and progress monitoring.

## 🎯 Overview

Gyaani is an educational mobile application that provides structured learning experiences across multiple subjects with progress tracking, streak management, and interactive quiz functionality. This backend serves as the API layer for the React Native frontend.

## ✨ Features

### Core Features
- **Subject Management** - Create and manage learning subjects (Mathematics, Physics, Chemistry, Biology)
- **Topic Management** - Organize topics within each subject with difficulty levels
- **Progress Tracking** - Real-time progress calculation and completion tracking
- **Topic Locking System** - Sequential learning progression with locked/unlocked topics
- **RESTful API** - Clean, consistent API endpoints with proper error handling
- **MongoDB Integration** - Scalable data persistence with MongoDB Atlas
- **TypeScript Support** - Type-safe development with full TypeScript integration

### Educational Features
- **Difficulty Levels** - Easy, Medium, Hard categorization for topics
- **Study Time Estimation** - Estimated completion time for each topic
- **Lesson Tracking** - Track completed lessons and total lessons per topic
- **Question Bank** - Track total questions available for each topic
- **Progress Analytics** - Calculate and track learning progress across subjects

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript
- **Validation**: class-validator, class-transformer
- **Environment**: Node.js
- **Cloud Database**: MongoDB Atlas

## 📁 Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
├── subjects/              # Subjects module
│   ├── dto/
│   │   ├── create-subject.dto.ts
│   │   └── update-subject.dto.ts
│   ├── schemas/
│   │   └── subject.schema.ts
│   ├── subjects.controller.ts
│   ├── subjects.service.ts
│   └── subjects.module.ts
├── topics/                # Topics module
│   ├── dto/
│   │   ├── create-topic.dto.ts
│   │   └── update-topic.dto.ts
│   ├── schemas/
│   │   └── topic.schema.ts
│   ├── topics.controller.ts
│   ├── topics.service.ts
│   └── topics.module.ts
└── common/                # Shared utilities (future)
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
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/gyaani-app?retryWrites=true&w=majority
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run start:dev
   ```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Response Format
All API responses follow this consistent format:
```json
{
  "success": true,
  "data": [/* actual data */]
}
```

### Endpoints

#### Subjects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subjects` | Get all subjects with topics |
| GET | `/subjects/:id` | Get specific subject by ID |
| GET | `/subjects/:name/topics` | Get topics for a specific subject |
| POST | `/subjects` | Create a new subject |
| PATCH | `/subjects/:id` | Update a subject |
| DELETE | `/subjects/:id` | Delete a subject |

#### Topics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/topics` | Get all topics |
| GET | `/topics/:id` | Get specific topic by ID |
| POST | `/topics` | Create a new topic |
| PATCH | `/topics/:id` | Update a topic |
| DELETE | `/topics/:id` | Delete a topic |

### Sample API Calls

#### Get All Subjects
```bash
curl http://localhost:3000/subjects
```

#### Get Mathematics Topics
```bash
curl http://localhost:3000/subjects/Mathematics/topics
```

#### Create a New Subject
```bash
curl -X POST http://localhost:3000/subjects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Computer Science",
    "color": "#6366f1",
    "description": "Learn programming and computer science concepts"
  }'
```

#### Create a New Topic
```bash
curl -X POST http://localhost:3000/topics \
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

## 📊 Data Models

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

1. Import the provided Postman collection
2. Set the base URL to `http://localhost:3000`
3. Test all endpoints with sample data

### Using curl

```bash
# Test server health
curl http://localhost:3000

# Get all subjects
curl http://localhost:3000/subjects

# Get specific subject topics
curl http://localhost:3000/subjects/Mathematics/topics
```

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


## 🙏 Acknowledgments

- NestJS team for the amazing framework
- MongoDB team for the database solution
- The open-source community for various packages

