# AstraLearn AI - System Architecture

## Overview

AstraLearn AI is a revolutionary learning platform that transforms education through advanced AI technologies. The system is built on a multi-layered architecture with specialized AI agents working in concert to provide personalized, adaptive learning experiences.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
│  React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ HTTPS/REST API
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  API Gateway Layer                          │
│              FastAPI (Python 3.11)                         │
│  - Request routing                                         │
│  - Authentication & Authorization                          │
│  - Rate limiting                                           │
│  - API documentation (OpenAPI/Swagger)                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼────┐  ┌────▼─────┐  ┌───▼──────────────┐
│   User     │  │ Content  │  │   Analytics      │
│ Service    │  │ Service  │  │   Service        │
│            │  │          │  │                  │
└────────────┘  └──────────┘  └──────────────────┘
        │             │                  │
        │             │                  │
┌───────▼─────────────▼──────────────────▼─────────────────────┐
│                Agent Orchestration Layer                      │
│           Master Controller Agent (LangChain)                │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐     │
│  │   Reader    │  │    Tutor     │  │    Content     │     │
│  │   Agent     │  │    Agent     │  │   Creation     │     │
│  │             │  │              │  │    Agent       │     │
│  └─────────────┘  └──────────────┘  └────────────────┘     │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐     │
│  │ Assessment  │  │Accessibility │  │  Engagement    │     │
│  │   Agent     │  │    Agent     │  │    Agent       │     │
│  │             │  │              │  │                │     │
│  └─────────────┘  └──────────────┘  └────────────────┘     │
└───────────────────────┬───────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼─────┐  ┌─────▼──────┐  ┌────▼──────────┐
│ PostgreSQL  │  │  MongoDB   │  │    Milvus     │
│             │  │            │  │  (Vectors)    │
│ - Users     │  │ - Content  │  │               │
│ - Progress  │  │ - Materials│  │ - Embeddings  │
│ - Sessions  │  │ - Metadata │  │ - Profiles    │
└─────────────┘  └────────────┘  └───────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Context + hooks
- **HTTP Client**: Fetch API

### Backend
- **API Gateway**: FastAPI (Python 3.11)
- **Async Runtime**: Uvicorn with ASGI
- **Authentication**: JWT tokens with python-jose
- **Validation**: Pydantic v2

### AI & ML
- **Agent Framework**: Agency Swarm
- **Orchestration**: LangChain
- **LLM Provider**: OpenAI API
- **Vector Operations**: pymilvus

### Data Layer
- **Relational DB**: PostgreSQL 15
- **Document Store**: MongoDB 7
- **Vector Database**: Milvus
- **Caching**: Redis 7

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose (dev), Kubernetes (prod)
- **CI/CD**: GitHub Actions
- **Monitoring**: (To be implemented)

## Component Details

### 1. Frontend Layer

The frontend provides an intuitive, accessible interface for learners:

- **Reading Interface**: Enhanced speed reading with adaptive pacing
- **Learning Dashboard**: Progress tracking and analytics
- **Content Browser**: Access to learning materials
- **Social Features**: Collaboration and peer learning
- **Settings**: Personalization and accessibility options

### 2. API Gateway

The FastAPI gateway serves as the single entry point:

- **Endpoints**:
  - `/api/health` - System health check
  - `/api/sessions/*` - Learning session management
  - `/api/users/*` - User profile and preferences
  - `/api/content/*` - Content retrieval
  - `/api/agents/*` - Agent task execution

- **Features**:
  - CORS configuration for frontend
  - Request validation
  - Error handling
  - API documentation at `/api/docs`

### 3. Agent System

#### Master Controller Agent
- Orchestrates all specialized agents
- Manages task queue with priority system
- Handles resource allocation
- Aggregates results from multiple agents

#### Reader Agent
- Intelligent text chunking
- Adaptive WPM calculation
- Reading pattern analysis
- Session preparation

#### Tutor Agent
- Socratic questioning
- Personalized explanations
- Understanding assessment
- Learning path suggestions

#### Content Creation Agent
- Exercise generation
- Summary creation
- Study guide production
- Format adaptation

#### Assessment Agent
- Session evaluation
- Progress tracking
- Performance analysis
- Report generation

#### Accessibility Agent
- Content accessibility analysis
- Vision adaptations
- Cognitive accessibility
- Alternative formats

#### Engagement Agent
- Gamification elements
- Achievement tracking
- Motivational feedback
- Social learning facilitation

### 4. Data Layer

#### PostgreSQL
- **Users**: Authentication, profiles, preferences
- **Sessions**: Learning session records
- **Progress**: Completion tracking, scores
- **Achievements**: Badges, milestones

#### MongoDB
- **Content**: Learning materials, articles
- **Exercises**: Practice questions, quizzes
- **Resources**: Supplementary materials
- **User Generated**: Notes, annotations

#### Milvus
- **User Embeddings**: Neural learning profiles
- **Content Embeddings**: Semantic search
- **Similarity Queries**: Recommendation engine

## Data Flow

### Reading Session Flow

1. User initiates reading session via frontend
2. Frontend sends request to API Gateway
3. Gateway authenticates and routes to session service
4. Master Controller creates task for Reader Agent
5. Reader Agent:
   - Retrieves content from MongoDB
   - Chunks text intelligently
   - Calculates adaptive WPM
6. Session data returned to frontend
7. User progress tracked in real-time
8. Assessment Agent evaluates on completion
9. Results stored in PostgreSQL
10. Engagement Agent awards achievements

### Learning Path Generation Flow

1. User requests personalized learning path
2. API Gateway routes to Tutor Agent
3. Tutor Agent:
   - Retrieves user profile from PostgreSQL
   - Queries learning history
   - Gets vector embeddings from Milvus
4. Generates custom learning path
5. Content Creation Agent:
   - Prepares materials for each step
   - Generates exercises
6. Path and materials stored in MongoDB
7. Results returned to user

## Security Architecture

### Authentication
- JWT token-based authentication
- Refresh token mechanism
- Secure password hashing (bcrypt)

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- API key management for services

### Data Protection
- Encrypted connections (TLS)
- Database encryption at rest
- Secure environment variable management
- Input validation and sanitization

## Scalability Considerations

### Horizontal Scaling
- Stateless API gateway allows multiple instances
- Load balancing across backend services
- Database replication for read scaling

### Caching Strategy
- Redis for session data
- API response caching
- Vector embedding caching

### Message Queue (Future)
- Async task processing
- Event-driven architecture
- Agent communication optimization

## Monitoring & Observability

### Metrics (To Implement)
- API response times
- Agent task completion rates
- Database query performance
- User engagement metrics

### Logging
- Structured logging with context
- Log aggregation
- Error tracking

### Health Checks
- Service health endpoints
- Database connectivity checks
- Agent system status

## Deployment Architecture

### Development
- Docker Compose for local development
- Hot reloading for frontend and backend
- Local database instances

### Production (Kubernetes)
- Microservices deployment
- Auto-scaling based on load
- Zero-downtime deployments
- Managed database services

## Future Enhancements

1. **Voice Interface**: Mozilla DeepSpeech integration
2. **AR/VR**: Three.js for immersive learning
3. **Real-time Collaboration**: WebSocket support
4. **Mobile Apps**: React Native implementation
5. **Offline Support**: Progressive Web App features
6. **Advanced Analytics**: Machine learning insights
