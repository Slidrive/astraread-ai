# AstraLearn AI - Developer Guide

## Table of Contents

1. [Development Setup](#development-setup)
2. [Architecture Overview](#architecture-overview)
3. [Backend Development](#backend-development)
4. [Frontend Development](#frontend-development)
5. [Agent Development](#agent-development)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Contributing](#contributing)

## Development Setup

### Prerequisites

- **Node.js**: 20.x or higher
- **Python**: 3.11 or higher
- **Docker**: Latest version
- **Docker Compose**: Latest version
- **Git**: For version control

### Initial Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Slidrive/astraread-ai.git
   cd astraread-ai
   ```

2. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit with your configuration
   nano .env
   ```

3. **Start Infrastructure with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This starts:
   - PostgreSQL (port 5432)
   - MongoDB (port 27017)
   - Redis (port 6379)
   - Milvus (port 19530)
   - FastAPI backend (port 8000)
   - Frontend dev server (port 5173)

4. **Verify Services**
   ```bash
   # Check service health
   curl http://localhost:8000/api/health
   
   # Access API docs
   open http://localhost:8000/api/docs
   
   # Access frontend
   open http://localhost:5173
   ```

### Manual Setup (Alternative)

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (when implemented)
# alembic upgrade head

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Architecture Overview

### Directory Structure

```
astraread-ai/
├── backend/                 # Python backend
│   ├── app/                # FastAPI application
│   │   ├── __init__.py
│   │   └── main.py        # Main API gateway
│   ├── agents/            # AI agent implementations
│   │   ├── master_controller.py
│   │   ├── reader_agent.py
│   │   ├── tutor_agent.py
│   │   ├── content_creation_agent.py
│   │   ├── assessment_agent.py
│   │   ├── accessibility_agent.py
│   │   └── engagement_agent.py
│   ├── tests/             # Backend tests
│   ├── config/            # Configuration files
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile         # Backend container
├── src/                    # React frontend
│   ├── components/        # React components
│   ├── lib/              # Utilities and services
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── docs/                   # Documentation
│   ├── architecture/      # System architecture
│   ├── api/              # API documentation
│   └── guides/           # User and dev guides
├── infrastructure/         # Infrastructure as code
│   ├── docker/           # Docker configurations
│   └── kubernetes/       # K8s manifests
├── docker-compose.yml     # Local development
└── package.json          # Node dependencies
```

## Backend Development

### Creating a New Endpoint

1. **Define Models** (in `app/main.py` or separate models file)
   ```python
   from pydantic import BaseModel
   
   class MyRequest(BaseModel):
       field1: str
       field2: int
   
   class MyResponse(BaseModel):
       result: str
       data: dict
   ```

2. **Add Endpoint**
   ```python
   @app.post("/api/my-endpoint", response_model=MyResponse)
   async def my_endpoint(request: MyRequest):
       # Process request
       result = process_data(request)
       return MyResponse(result="success", data=result)
   ```

3. **Add Tests**
   ```python
   # backend/tests/test_api.py
   def test_my_endpoint():
       response = client.post(
           "/api/my-endpoint",
           json={"field1": "test", "field2": 42}
       )
       assert response.status_code == 200
       assert response.json()["result"] == "success"
   ```

### Database Operations

#### PostgreSQL (SQLAlchemy)

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Create engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# Use session
def get_user(user_id: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        return user
    finally:
        db.close()
```

#### MongoDB (PyMongo)

```python
from pymongo import MongoClient

client = MongoClient(MONGODB_URL)
db = client.astralearn

# Insert document
def save_content(content_data):
    result = db.content.insert_one(content_data)
    return str(result.inserted_id)

# Query documents
def get_content(content_id):
    return db.content.find_one({"_id": content_id})
```

#### Milvus (Vector DB)

```python
from pymilvus import connections, Collection

# Connect to Milvus
connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)

# Create collection
from pymilvus import CollectionSchema, FieldSchema, DataType

fields = [
    FieldSchema(name="id", dtype=DataType.INT64, is_primary=True),
    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=768)
]
schema = CollectionSchema(fields, description="User embeddings")
collection = Collection("user_profiles", schema)

# Insert vectors
collection.insert([ids, embeddings])

# Search
results = collection.search(
    data=[query_vector],
    anns_field="embedding",
    param={"metric_type": "L2", "params": {"nprobe": 10}},
    limit=10
)
```

## Frontend Development

### Component Structure

```typescript
// src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  data: any[];
  onAction: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  data, 
  onAction 
}) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {/* Component content */}
    </div>
  );
};
```

### API Integration

```typescript
// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchUserProfile(userId: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
}
```

### State Management

```typescript
// Using React Context
import { createContext, useContext, useState } from 'react';

interface AppState {
  user: User | null;
  setUser: (user: User) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
```

## Agent Development

### Creating a New Agent

1. **Create Agent File** (`backend/agents/my_agent.py`)
   ```python
   import logging
   from typing import Dict, List
   
   logger = logging.getLogger(__name__)
   
   class MyAgent:
       """
       My Custom Agent
       
       Purpose: Description of what this agent does
       Capabilities:
       - Capability 1
       - Capability 2
       """
       
       def __init__(self):
           logger.info("My Agent initialized")
       
       def perform_task(self, input_data: Dict) -> Dict:
           """Main task processing method"""
           logger.info(f"Processing task with input: {input_data}")
           
           # Agent logic here
           result = self._process(input_data)
           
           return {
               "status": "success",
               "result": result
           }
       
       def _process(self, data: Dict) -> Dict:
           """Internal processing logic"""
           # Implementation
           return {}
   
   # Global instance
   my_agent = MyAgent()
   ```

2. **Register with Master Controller**
   ```python
   from backend.agents.master_controller import master_controller, AgentType
   from backend.agents.my_agent import my_agent
   
   # Add to AgentType enum
   class AgentType(Enum):
       # ... existing types
       MY_AGENT = "my_agent"
   
   # Register
   master_controller.register_agent(AgentType.MY_AGENT, my_agent)
   ```

3. **Add API Endpoint**
   ```python
   @app.post("/api/agents/my-agent/execute")
   async def execute_my_agent(request: dict):
       task_id = master_controller.create_task(
           AgentType.MY_AGENT,
           "Task description",
           context=request
       )
       master_controller.delegate_task(task_id)
       return {"task_id": task_id}
   ```

### Agent Communication

Agents can communicate through the Master Controller:

```python
# In one agent
result = master_controller.create_task(
    AgentType.TUTOR,
    "Generate questions",
    context={"content": content}
)

# Retrieve result
status = master_controller.get_task_status(task_id)
tutor_result = status["result"]
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov=agents

# Run specific test file
pytest tests/test_agents.py

# Run specific test
pytest tests/test_agents.py::test_reader_agent
```

### Frontend Tests

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Integration Tests

```python
# backend/tests/test_integration.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_reading_session():
    # Start session
    response = client.post("/api/sessions/start", json={
        "user_id": "test_user",
        "content_id": "test_content",
        "session_type": "speed_reading"
    })
    assert response.status_code == 200
    session_id = response.json()["session_id"]
    
    # Get status
    response = client.get(f"/api/sessions/{session_id}")
    assert response.status_code == 200
    assert response.json()["status"] == "started"
```

## Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Kubernetes Deployment

```bash
# Apply configurations
kubectl apply -f infrastructure/kubernetes/

# Check deployment
kubectl get pods
kubectl get services

# View logs
kubectl logs -f deployment/astralearn-backend

# Scale deployment
kubectl scale deployment astralearn-backend --replicas=3
```

### Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
MONGODB_URL=mongodb://user:pass@host:27017
REDIS_URL=redis://host:6379
MILVUS_HOST=host
MILVUS_PORT=19530

# API Keys
OPENAI_API_KEY=your_openai_key
JWT_SECRET_KEY=your_secret_key

# App Config
ENVIRONMENT=production
LOG_LEVEL=INFO
CORS_ORIGINS=https://app.astralearn.ai
```

## Contributing

### Code Style

**Python**:
- Follow PEP 8
- Use type hints
- Docstrings for all public functions
- Maximum line length: 100 characters

**TypeScript**:
- Use TypeScript strict mode
- Functional components with hooks
- Meaningful variable names
- Export types and interfaces

### Git Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make Changes**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

3. **Push and Create PR**
   ```bash
   git push origin feature/my-feature
   ```

4. **Code Review**
   - All PRs require review
   - CI must pass
   - No merge conflicts

### Commit Messages

Follow conventional commits:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:
```
feat(agents): add sentiment analysis to tutor agent

- Implement sentiment detection
- Adjust responses based on user emotion
- Add tests for sentiment analysis
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

## Debugging

### Backend Debugging

```python
# Add debug logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Use debugger
import pdb; pdb.set_trace()

# Or with ipdb (install: pip install ipdb)
import ipdb; ipdb.set_trace()
```

### Frontend Debugging

```typescript
// Console logging
console.log('Debug:', variable);
console.table(arrayData);

// React DevTools
// Install browser extension for component inspection

// Network debugging
// Use browser DevTools Network tab
```

### Docker Debugging

```bash
# Enter container
docker-compose exec backend bash

# View container logs
docker-compose logs -f backend

# Inspect container
docker inspect astraread-backend
```

## Performance Optimization

### Backend
- Use async/await for I/O operations
- Implement caching with Redis
- Optimize database queries
- Use connection pooling

### Frontend
- Code splitting with lazy loading
- Memoize expensive computations
- Optimize re-renders
- Use virtual scrolling for large lists

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [LangChain Documentation](https://python.langchain.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Milvus Documentation](https://milvus.io/docs)

---

For questions or support, contact the development team or open an issue on GitHub.
