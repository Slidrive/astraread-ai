# Quick Start Guide - AstraLearn AI

## 🚀 Get Running in 5 Minutes

### Option 1: Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Slidrive/astraread-ai.git
cd astraread-ai

# 2. Create environment file
cp .env.example .env

# 3. Start all services
docker-compose up -d

# 4. Wait for services to be ready (30-60 seconds)
docker-compose ps

# 5. Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/api/docs
```

That's it! All services are running:
- PostgreSQL (port 5432)
- MongoDB (port 27017)  
- Redis (port 6379)
- Milvus (port 19530)
- Backend API (port 8000)
- Frontend (port 5173)

### Option 2: Manual Setup

#### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- MongoDB 7+
- Redis 7+

#### Backend Setup

```bash
# Navigate to backend
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

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`

#### Frontend Setup

```bash
# From project root
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 📝 First Steps

### 1. Test the API

```bash
# Health check
curl http://localhost:8000/api/health

# View API documentation
open http://localhost:8000/api/docs
```

### 2. Try Speed Reading

1. Open http://localhost:5173
2. Click "Text Input" tab
3. Paste some text or click "Load Sample Text"
4. Click "Start Reading"
5. Use Space to play/pause, arrows to skip

### 3. Explore the Agent System

```bash
# Example: Execute reader agent task
curl -X POST http://localhost:8000/api/agents/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_type": "reader",
    "task": "prepare_session",
    "context": {
      "text": "Your text here...",
      "wpm": 500
    }
  }'
```

## 🧪 Run Tests

```bash
# Frontend tests
npm test

# Backend tests
cd backend
pytest
```

## 📚 Next Steps

1. **Read the Documentation**:
   - [System Architecture](docs/architecture/SYSTEM_ARCHITECTURE.md)
   - [API Reference](docs/api/API_REFERENCE.md)
   - [Developer Guide](docs/guides/DEVELOPER_GUIDE.md)

2. **Configure Environment**:
   - Edit `.env` file
   - Add OpenAI API key (for AI features)
   - Configure database connections

3. **Explore the Code**:
   - `backend/agents/` - AI agent implementations
   - `backend/app/main.py` - API gateway
   - `src/App.tsx` - Frontend main component

4. **Try the Agents**:
   - Reader Agent: Text chunking and adaptive speed
   - Tutor Agent: Question generation
   - Assessment Agent: Progress tracking
   - Engagement Agent: Gamification

## 🐛 Troubleshooting

### Docker Issues

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild containers
docker-compose up -d --build

# Stop all services
docker-compose down
```

### Port Already in Use

If ports are already occupied:

```bash
# Change ports in docker-compose.yml
# For example, change frontend port:
ports:
  - "3000:5173"  # Use 3000 instead of 5173
```

### Dependencies Not Installing

```bash
# Clear caches
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Python
pip cache purge
pip install -r requirements.txt --no-cache-dir
```

## 🔑 Important Notes

1. **Default Credentials** (Development Only):
   - PostgreSQL: `astralearn / changeme`
   - MongoDB: `astralearn / changeme`
   - **Change these in production!**

2. **API Keys Required**:
   - OpenAI API key needed for full AI features
   - Add to `.env` file: `OPENAI_API_KEY=your_key_here`

3. **Production Deployment**:
   - See `docs/guides/DEVELOPER_GUIDE.md`
   - Use Kubernetes manifests in `infrastructure/kubernetes/`
   - Configure proper secrets management

## 📞 Get Help

- **Documentation**: Check `docs/` directory
- **Issues**: GitHub Issues
- **API Docs**: http://localhost:8000/api/docs (when running)

## 🎯 Quick Commands Reference

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop everything
docker-compose down

# Restart a service
docker-compose restart backend

# Build frontend
npm run build

# Run backend with reload
cd backend && uvicorn app.main:app --reload

# Check service health
curl http://localhost:8000/api/health
```

---

**Ready to build the future of learning!** 🚀

For detailed information, see the [Developer Guide](docs/guides/DEVELOPER_GUIDE.md).
