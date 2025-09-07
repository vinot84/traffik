# 🚀 Local Demo Setup Guide

## Quick Start for Mac

### Option 1: Instant Demo (No Setup Required)
```bash
# Just open the standalone demo
open standalone.html
```

### Option 2: Full Backend Integration Demo

#### Prerequisites
- Docker Desktop for Mac installed and running
- Java 21+ (for backend development)

#### 1-Command Setup
```bash
# Make the script executable and run
chmod +x start-demo.sh && ./start-demo.sh
```

#### Manual Setup (if script fails)

1. **Start Database Services**
```bash
# Start just the database and supporting services
docker-compose -f docker-compose.services.yml up -d

# Wait for services to be ready
docker-compose -f docker-compose.services.yml logs -f postgres
```

2. **Run Backend Locally**
```bash
cd backend
./gradlew bootRun
```

3. **Test the Setup**
```bash
# Health check
curl http://localhost:8080/api/v1/actuator/health

# Register a test user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@traafik.com",
    "password": "password123",
    "firstName": "Demo",
    "lastName": "User",
    "role": "DRIVER"
  }'
```

## Available Services

### Frontend
- **Standalone Demo**: `standalone.html` (works immediately)
- **Development Server**: `npm run dev` (if packages installed)

### Backend
- **API Server**: http://localhost:8080/api/v1
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/api/v1/actuator/health

### Database & Tools
- **PostgreSQL**: localhost:5432 (traafik/traafik123)
- **Redis**: localhost:6379
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin123)
- **MailHog**: http://localhost:8025

## Demo Flow

### 1. User Registration & Login
```bash
# Register as Driver
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"driver@demo.com","password":"password123","firstName":"John","lastName":"Doe","role":"DRIVER"}'

# Register as Officer  
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"officer@demo.com","password":"password123","firstName":"Jane","lastName":"Smith","role":"OFFICER"}'
```

### 2. Create Traffic Stop Session
```bash
# Driver creates session
curl -X POST http://localhost:8080/api/v1/sessions \
  -H "Content-Type: application/json" \
  -H "Cookie: traafik-token=YOUR_JWT_TOKEN" \
  -d '{"address":"123 Main St, City, State","reason":"Traffic violation","latitude":40.7128,"longitude":-74.0060}'
```

### 3. Officer Assignment
```bash
# Officer assigns to session
curl -X PUT http://localhost:8080/api/v1/sessions/{sessionId}/assign \
  -H "Cookie: traafik-token=OFFICER_JWT_TOKEN" \
  -X PUT
```

## Troubleshooting

### Docker Issues
```bash
# Check if Docker is running
docker info

# View service logs
docker-compose -f docker-compose.services.yml logs [service-name]

# Reset everything
docker-compose -f docker-compose.services.yml down -v
```

### Backend Issues
```bash
# Check Java version
java --version

# Clean and rebuild
cd backend && ./gradlew clean build

# Run with debug logging
./gradlew bootRun --args='--logging.level.com.traafik=DEBUG'
```

### Database Issues
```bash
# Connect to PostgreSQL
docker exec -it traafik-postgres psql -U traafik -d traafik

# Check tables
\dt

# View users
SELECT * FROM users;
```

## Development Notes

- **JWT Tokens**: Stored in httpOnly cookies for security
- **CORS**: Configured for localhost:3000 and localhost:5173
- **Database**: Auto-created with Flyway migrations
- **API Spec**: Available at `/swagger-ui.html` when backend is running
- **Health Checks**: All services have health endpoints for monitoring

## Next Steps

1. **Frontend Integration**: Connect React app to backend API
2. **Real-time Features**: Add WebSocket support for session updates  
3. **Payment Integration**: Connect Stripe for citation payments
4. **Mobile App**: React Native version for mobile devices
5. **Deployment**: Docker production setup with reverse proxy

---

🚓 **Happy coding with Traafik!** ✨