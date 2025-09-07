# Traafik - Remote Traffic Stop Management System

A modern, full-stack application for managing remote traffic stops with secure communication between drivers and law enforcement officers.

## 🚀 Quick Start

### Frontend (React + TypeScript)
```bash
# Working demo (no dependencies required)
open standalone.html
```

### Backend (Java 21 + Spring Boot)
```bash
docker-compose up -d  # Start all services
curl http://localhost:8080/api/v1/actuator/health
```

## 📁 Project Structure

```
traffik/
├── frontend/                 # React + TypeScript SPA
│   ├── src/
│   │   ├── components/      # Reusable UI components  
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript interfaces
│   ├── standalone.html     # Working demo (no dependencies)
│   └── package.json
├── backend/                 # Java 21 + Spring Boot API
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration & migrations
│   └── build.gradle        # Gradle build configuration
└── docker-compose.yml      # Full development environment
```

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive design
- **Vite** for fast development and optimized builds
- **Context API** for state management and routing

### Backend Stack  
- **Java 21** with Spring Boot 3.2 framework
- **PostgreSQL 16** with PostGIS for geospatial data
- **JWT Authentication** with cookie-based security
- **Redis** for caching and session management

### Key Features
- 🔐 **Role-based authentication** (Driver/Officer/Admin)
- 📍 **Real-time location tracking** with PostGIS
- 💳 **Integrated payment processing** via Stripe
- 📱 **Responsive design** for mobile and desktop
- 🔄 **State machine workflow** for traffic stop sessions
- 📊 **Monitoring & observability** with Prometheus/Grafana

## 🌟 Highlights

### Production-Ready Features
- **Security**: JWT authentication, CSRF protection, input validation
- **Performance**: Redis caching, database optimization, CDN support  
- **Monitoring**: Health checks, metrics, structured logging
- **Testing**: Unit tests, integration tests with Testcontainers
- **Documentation**: OpenAPI specification, Swagger UI

### Demo Capabilities
- **Immediate Preview**: `standalone.html` works without setup
- **Complete User Flows**: Login → Dashboard → Session → Payment
- **Role-Based Access**: Different features for drivers, officers, admins
- **Interactive Session Flow**: Step-by-step traffic stop process

## 🚀 Getting Started

### Option 1: Full Development Environment
```bash
git clone https://github.com/vinot84/traffik.git
cd traffik
docker-compose up -d
```

### Option 2: Quick Demo
```bash
git clone https://github.com/vinot84/traffik.git
cd traffik
open standalone.html  # View working demo immediately
```

## 📚 Documentation

- [Frontend README](./src/README.md) - React application details
- [Backend README](./backend/README.md) - API documentation  
- [API Documentation](http://localhost:8080/swagger-ui.html) - Interactive API explorer

---

**Built for safer, more transparent traffic stops.** 🚓✨