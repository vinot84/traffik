# Traafik Backend API

A modern, production-ready REST API for the Traafik remote traffic stop management system, built with Java 21 and Spring Boot 3.

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Docker & Docker Compose
- PostgreSQL 16+ with PostGIS extension

### 3-Command Setup
```bash
# 1. Clone and navigate to project
git clone https://github.com/vinot84/traffik.git && cd traffik

# 2. Start all services with Docker Compose
docker-compose up -d

# 3. Verify services are running
curl http://localhost:8080/api/v1/actuator/health
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   Backend API   │────│   PostgreSQL    │
│   (React)       │    │  (Spring Boot)  │    │   + PostGIS     │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌──────┴──────┐
                       │             │
                ┌─────────────┐ ┌─────────────┐
                │    Redis    │ │    MinIO    │
                │   (Cache)   │ │  (Storage)  │
                │ Port: 6379  │ │ Port: 9000  │
                └─────────────┘ └─────────────┘
```

## 🔧 Technology Stack

### Core Framework
- **Java 21** - Latest LTS with modern language features
- **Spring Boot 3.2** - Enterprise application framework
- **Spring Security 6** - Authentication and authorization
- **Spring Data JPA** - Data persistence layer

### Database & Storage
- **PostgreSQL 16** - Primary database with ACID compliance
- **PostGIS** - Geospatial data support for location tracking
- **Redis 7** - Caching and session management
- **MinIO** - S3-compatible object storage for file attachments

### Security & Authentication
- **JWT (JSON Web Tokens)** - Stateless authentication
- **BCrypt** - Password hashing
- **Cookie-based auth** - Secure token storage
- **CSRF protection** - Cross-site request forgery prevention

### Documentation & API
- **OpenAPI 3.1** - API specification and documentation
- **Swagger UI** - Interactive API explorer
- **Contract-first development** - API-driven design

### Monitoring & Observability
- **Spring Actuator** - Application metrics and health checks
- **Micrometer + Prometheus** - Metrics collection
- **Grafana** - Monitoring dashboards
- **Structured logging** - JSON-formatted logs with trace IDs

### Development & Testing
- **Gradle** - Build automation and dependency management
- **Testcontainers** - Integration testing with real databases
- **JUnit 5** - Unit and integration testing
- **Docker** - Containerization and deployment

## 📊 Database Schema

### Core Entities
- **Users** - Driver, Officer, and Admin accounts
- **UserProfiles** - Personal information and KYC status
- **Sessions** - Traffic stop sessions with state machine
- **Citations** - Issued violations and fines
- **Payments** - Stripe integration for fine payments

### Key Features
- **PostGIS Integration** - Precise location tracking and geospatial queries
- **State Machine** - Session workflow: Created → Assigned → Verified → Completed
- **Audit Trail** - Complete history of state transitions
- **File Attachments** - Evidence and document storage

## 🔐 Security Features

### Authentication & Authorization
```java
// JWT-based authentication with role-based access
@PreAuthorize("hasRole('OFFICER')")
public ResponseEntity<Citation> issueCitation(@RequestBody CitationRequest request)

// Method-level security with custom expressions
@PreAuthorize("@sessionService.hasAccessToSession(#sessionId, authentication.name)")
public ResponseEntity<Session> getSession(@PathVariable UUID sessionId)
```

### Security Configuration
- **Cookie-based JWT storage** - HttpOnly, Secure, SameSite protection
- **CORS configuration** - Proper cross-origin resource sharing
- **CSRF protection** - Token-based verification
- **Rate limiting** - Request throttling per user/IP

## 🌐 API Endpoints

### Authentication
```http
POST /api/v1/auth/register    # User registration
POST /api/v1/auth/login       # User authentication
POST /api/v1/auth/refresh     # Token refresh
POST /api/v1/auth/logout      # User logout
GET  /api/v1/auth/me          # Current user info
```

### Sessions (Traffic Stops)
```http
POST /api/v1/sessions              # Create new session
GET  /api/v1/sessions/my           # User's sessions
GET  /api/v1/sessions/active       # Active sessions (officers)
PUT  /api/v1/sessions/{id}/status  # Update session status
PUT  /api/v1/sessions/{id}/assign  # Assign officer
```

### Citations & Payments
```http
POST /api/v1/citations                    # Issue citation
GET  /api/v1/citations/my                 # User's citations
POST /api/v1/citations/{id}/payment       # Process payment
GET  /api/v1/citations/{id}/receipt       # Payment receipt
```

## 🧪 Testing Strategy

### Test Pyramid
```
    ┌─────────────────┐
    │   E2E Tests     │  <- Playwright (Frontend integration)
    │   (Few)         │
    └─────────────────┘
           │
    ┌─────────────────┐
    │ Integration     │  <- Testcontainers + Spring Boot Test
    │ Tests           │
    │ (Some)          │
    └─────────────────┘
           │
    ┌─────────────────┐
    │   Unit Tests    │  <- JUnit 5 + Mockito
    │   (Many)        │
    └─────────────────┘
```

### Running Tests
```bash
# Unit tests
./gradlew test

# Integration tests with Testcontainers
./gradlew integrationTest

# All tests with coverage
./gradlew check jacocoTestReport
```

## 🚀 Deployment

### Docker Production Build
```dockerfile
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY build/libs/traafik-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Environment Configuration
```yaml
# production.yml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
  
  security:
    oauth2:
      client:
        registration:
          stripe:
            client-id: ${STRIPE_CLIENT_ID}
            client-secret: ${STRIPE_CLIENT_SECRET}
```

## 📈 Performance & Scalability

### Caching Strategy
- **Redis caching** for frequently accessed data
- **JPA second-level cache** for entity caching
- **HTTP response caching** with ETags

### Database Optimization
- **Connection pooling** with HikariCP
- **Read replicas** for analytics queries
- **Indexes** on frequently queried columns
- **PostGIS spatial indexes** for location queries

### Monitoring
- **Application metrics** via Micrometer
- **Database metrics** via PostgreSQL stats
- **Custom business metrics** for session flows
- **Alert thresholds** for response times and error rates

## 🛠️ Development

### Local Development Setup
```bash
# Start dependencies
docker-compose up postgres redis minio

# Run application in development mode
./gradlew bootRun --args='--spring.profiles.active=dev'

# Access Swagger UI
open http://localhost:8080/swagger-ui.html
```

### Code Quality
- **Checkstyle** - Code style enforcement
- **SpotBugs** - Static analysis for bug detection
- **Jacoco** - Code coverage reporting
- **SonarQube** - Comprehensive code quality analysis

## 🔄 API Integration Examples

### Frontend Integration
```typescript
// TypeScript client example
const sessionResponse = await apiClient.post('/sessions', {
  location: { latitude: 40.7128, longitude: -74.0060 },
  reason: 'Traffic violation'
});

// Automatic token refresh on 401
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await refreshAuthToken();
      return apiClient.request(error.config);
    }
  }
);
```

### cURL Examples
```bash
# Login and get JWT token
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"driver@example.com","password":"password123"}' \
  -c cookies.txt

# Create session (using cookie authentication)
curl -X POST http://localhost:8080/api/v1/sessions \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"location":{"latitude":40.7128,"longitude":-74.0060}}'
```

## 🏆 Production Ready Features

### Non-Functional Requirements
- **Performance**: < 200ms response time for 95th percentile
- **Availability**: 99.9% uptime with health checks
- **Scalability**: Horizontal scaling with load balancing
- **Security**: OWASP compliance with security scanning
- **Maintainability**: Clean architecture with SOLID principles

### Compliance & Privacy
- **Data encryption** at rest and in transit
- **PII handling** with proper anonymization
- **Audit logging** for compliance requirements
- **GDPR compliance** with data export/deletion

---

## 📚 Additional Resources

- [API Documentation](http://localhost:8080/swagger-ui.html)
- [Frontend Repository](../frontend)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

Built with ❤️ for safer traffic stops.