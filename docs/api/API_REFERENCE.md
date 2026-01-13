# AstraLearn AI - API Documentation

## Base URL

```
Development: http://localhost:8000
Production: https://api.astralearn.ai
```

## Authentication

Most endpoints require authentication using JWT tokens.

### Getting a Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "secure_password"
}
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Using the Token

Include the token in the Authorization header:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

## Core Endpoints

### Health Check

Check system health and service status.

```http
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "services": {
    "api_gateway": "operational",
    "agent_system": "initializing",
    "database": "pending",
    "vector_db": "pending"
  }
}
```

### Root Information

```http
GET /
```

Response:
```json
{
  "message": "AstraLearn AI - Revolutionary Learning Platform",
  "version": "0.1.0",
  "documentation": "/api/docs"
}
```

## Learning Session Endpoints

### Start Learning Session

Create a new learning session.

```http
POST /api/sessions/start
Content-Type: application/json
Authorization: Bearer {token}

{
  "user_id": "user_123",
  "content_id": "article_456",
  "session_type": "speed_reading",
  "wpm": 500
}
```

Response:
```json
{
  "session_id": "session_789",
  "status": "started",
  "user_id": "user_123",
  "content_id": "article_456"
}
```

### Get Session Status

Retrieve the status of an active or completed session.

```http
GET /api/sessions/{session_id}
Authorization: Bearer {token}
```

Response:
```json
{
  "session_id": "session_789",
  "status": "active",
  "progress": 45.5,
  "metrics": {
    "chunks_completed": 100,
    "total_chunks": 220,
    "current_wpm": 500,
    "elapsed_time_seconds": 300
  }
}
```

## User Profile Endpoints

### Get User Profile

Retrieve user's learning profile and preferences.

```http
GET /api/users/{user_id}/profile
Authorization: Bearer {token}
```

Response:
```json
{
  "user_id": "user_123",
  "learning_style": "adaptive",
  "preferences": {
    "default_wpm": 500,
    "theme": "dark",
    "font_size": "medium",
    "accessibility": {
      "high_contrast": false,
      "screen_reader": false
    }
  },
  "progress": {
    "total_sessions": 45,
    "total_reading_time_minutes": 1350,
    "average_wpm": 520,
    "achievements": 12
  }
}
```

### Update User Profile

```http
PATCH /api/users/{user_id}/profile
Content-Type: application/json
Authorization: Bearer {token}

{
  "preferences": {
    "default_wpm": 600,
    "theme": "light"
  }
}
```

## Content Endpoints

### Get Content

Retrieve learning content by ID.

```http
GET /api/content/{content_id}
Authorization: Bearer {token}
```

Response:
```json
{
  "content_id": "article_456",
  "type": "text",
  "title": "Introduction to Machine Learning",
  "author": "Dr. Jane Smith",
  "difficulty": "medium",
  "estimated_reading_time": 15,
  "data": {
    "text": "Machine learning is a subset of artificial intelligence...",
    "word_count": 3500,
    "language": "en"
  },
  "metadata": {
    "topics": ["AI", "Machine Learning", "Data Science"],
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

### List Available Content

```http
GET /api/content?category={category}&difficulty={difficulty}&page={page}
Authorization: Bearer {token}
```

Query Parameters:
- `category`: Content category (optional)
- `difficulty`: easy, medium, hard (optional)
- `page`: Page number for pagination (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response:
```json
{
  "items": [
    {
      "content_id": "article_456",
      "title": "Introduction to Machine Learning",
      "type": "text",
      "difficulty": "medium",
      "estimated_reading_time": 15
    }
  ],
  "total": 150,
  "page": 1,
  "pages": 8
}
```

## Agent System Endpoints

### Execute Agent Task

Send a task to the agent system for processing.

```http
POST /api/agents/execute
Content-Type: application/json
Authorization: Bearer {token}

{
  "agent_type": "tutor",
  "task": "generate_questions",
  "context": {
    "content_id": "article_456",
    "difficulty": "medium",
    "count": 5
  }
}
```

Response:
```json
{
  "status": "accepted",
  "agent_type": "tutor",
  "task_id": "task_xyz123",
  "message": "Task queued for processing"
}
```

### Get Task Status

Check the status of an agent task.

```http
GET /api/agents/tasks/{task_id}
Authorization: Bearer {token}
```

Response:
```json
{
  "task_id": "task_xyz123",
  "agent_type": "tutor",
  "status": "completed",
  "result": {
    "questions": [
      {
        "question": "What are the key components of machine learning?",
        "type": "comprehension",
        "difficulty": "medium"
      }
    ]
  }
}
```

## Reader Agent Endpoints

### Prepare Reading Session

Prepare a reading session with intelligent chunking.

```http
POST /api/agents/reader/prepare
Content-Type: application/json
Authorization: Bearer {token}

{
  "text": "Your content here...",
  "user_preferences": {
    "wpm": 500,
    "complexity": "medium"
  }
}
```

Response:
```json
{
  "chunks": [
    {
      "words": ["First", "chunk", "of"],
      "text": "First chunk of",
      "index": 0,
      "focus_word_index": 1
    }
  ],
  "wpm": 500,
  "total_words": 1500,
  "estimated_duration_minutes": 3.0,
  "chunk_count": 500
}
```

## Tutor Agent Endpoints

### Generate Questions

Generate Socratic questions based on content.

```http
POST /api/agents/tutor/questions
Content-Type: application/json
Authorization: Bearer {token}

{
  "content": "Learning content text...",
  "difficulty_level": "medium",
  "count": 5
}
```

Response:
```json
{
  "questions": [
    {
      "question": "What are the key concepts in this material?",
      "type": "comprehension",
      "difficulty": "medium",
      "purpose": "Assess basic understanding"
    }
  ]
}
```

### Get Learning Path

Request a personalized learning path.

```http
POST /api/agents/tutor/learning-path
Content-Type: application/json
Authorization: Bearer {token}

{
  "user_id": "user_123",
  "goal": "Master machine learning fundamentals"
}
```

Response:
```json
{
  "learning_path": [
    {
      "step": 1,
      "title": "Foundation",
      "description": "Build core understanding",
      "estimated_duration": "2 hours",
      "resources": ["article_123", "video_456"]
    }
  ]
}
```

## Assessment Agent Endpoints

### Get Progress Report

Generate a progress report for a user.

```http
GET /api/agents/assessment/report/{user_id}?type={report_type}
Authorization: Bearer {token}
```

Query Parameters:
- `type`: daily, weekly, monthly (default: weekly)

Response:
```json
{
  "user_id": "user_123",
  "report_type": "weekly",
  "generated_at": "2024-01-20T10:00:00Z",
  "summary": {
    "sessions_completed": 15,
    "total_learning_time": "7.5 hours",
    "average_score": "85%",
    "improvement": "+12%"
  },
  "achievements": [
    {
      "title": "Speed Reader",
      "earned_at": "2024-01-18T14:30:00Z"
    }
  ]
}
```

## Content Creation Agent Endpoints

### Generate Exercises

Create practice exercises from content.

```http
POST /api/agents/content/exercises
Content-Type: application/json
Authorization: Bearer {token}

{
  "source_content": "Learning material text...",
  "exercise_type": "multiple_choice",
  "count": 5
}
```

Response:
```json
{
  "exercises": [
    {
      "id": "ex_1",
      "type": "multiple_choice",
      "question": "Question based on content",
      "difficulty": "medium",
      "points": 10,
      "options": [
        {"id": "A", "text": "Option A"},
        {"id": "B", "text": "Option B"}
      ],
      "correct_option": "A"
    }
  ]
}
```

## Engagement Agent Endpoints

### Get Achievements

Retrieve user achievements.

```http
GET /api/agents/engagement/achievements/{user_id}
Authorization: Bearer {token}
```

Response:
```json
{
  "achievements": [
    {
      "id": "speed_master",
      "title": "Speed Master",
      "description": "Read at 600+ WPM",
      "icon": "trophy",
      "earned_at": "2024-01-15T10:00:00Z",
      "rarity": "rare"
    }
  ],
  "total_points": 2500
}
```

### Get Leaderboard

```http
GET /api/agents/engagement/leaderboard?category={category}&timeframe={timeframe}
Authorization: Bearer {token}
```

Response:
```json
{
  "category": "reading_speed",
  "timeframe": "week",
  "rankings": [
    {
      "rank": 1,
      "user": "User123",
      "score": 1000,
      "badge": "gold"
    }
  ]
}
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

Common HTTP Status Codes:
- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting

API requests are rate-limited:
- **Authenticated**: 1000 requests per hour
- **Unauthenticated**: 100 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

## Pagination

List endpoints support pagination:

```
GET /api/content?page=2&limit=50
```

Response includes pagination metadata:
```json
{
  "items": [],
  "pagination": {
    "page": 2,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

## WebSocket Endpoints (Future)

Real-time updates for learning sessions:

```
ws://localhost:8000/ws/sessions/{session_id}
```

## Interactive API Documentation

Full interactive API documentation available at:
- Swagger UI: `/api/docs`
- ReDoc: `/api/redoc`
