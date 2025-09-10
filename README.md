# Citation Management System

A complete citation management system with iOS app for users and web portals for officers and administrators.

## Architecture

- **iOS App**: Native SwiftUI app for users (iOS 16+)
- **Web Portals**: React + TypeScript portals for officers and administrators
- **Microservices**: 3 REST services (auth, driver, citation)
- **Database**: PostgreSQL with schema separation
- **Storage**: Local file storage for uploads
- **Proxy**: Nginx reverse proxy

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Xcode 14+ (for iOS app)
- Node.js 18+ (for web development)

### 1. Start the System
```bash
# Clone and navigate
cd citation-system

# Copy environment files
cp .env.example .env
cp services/auth-svc/.env.example services/auth-svc/.env
cp services/driver-svc/.env.example services/driver-svc/.env
cp services/citation-svc/.env.example services/citation-svc/.env

# Start all services
docker compose up -d
```

### 2. Initialize Database
```bash
# Wait for services to start, then run migrations
docker compose exec auth-svc npm run migrate
docker compose exec driver-svc npm run migrate
docker compose exec citation-svc npm run migrate
```

### 3. Access Applications
- **Web Portal**: http://localhost:8080/portal
- **API Documentation**: http://localhost:8080/docs
- **iOS App**: Open `ios/UserApp/UserApp.xcworkspace` in Xcode

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/citations` |
| `JWT_SECRET` | JWT signing secret | Generated randomly |
| `JWT_EXPIRES_IN` | JWT expiration time | `1h` |
| `REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` |
| `UPLOAD_MAX_SIZE` | Maximum upload size (bytes) | `10485760` (10MB) |
| `PROXIMITY_RADIUS_METERS` | Officer-user proximity requirement | `100` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000,capacitor://localhost` |

## First Run Setup

### 1. Create Test Accounts
```bash
# Create admin user
curl -X POST http://localhost:8080/auth/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123", "role": "admin"}'

# Create officer user
curl -X POST http://localhost:8080/auth/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "officer@test.com", "password": "officer123", "role": "officer"}'

# Create regular user (for iOS app)
curl -X POST http://localhost:8080/auth/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "password": "user123", "role": "user"}'
```

### 2. Login to Web Portal
- Navigate to http://localhost:8080/portal
- Use officer@test.com / officer123 for officer portal
- Use admin@test.com / admin123 for admin portal

### 3. iOS App Setup
1. Open `ios/UserApp/UserApp.xcworkspace` in Xcode
2. Update the base URL in `NetworkManager.swift` if needed (defaults to localhost:8080)
3. Build and run in simulator
4. Login with user@test.com / user123

## Development

### Services Development
```bash
# Run individual service in development mode
cd services/auth-svc
npm install
npm run dev
```

### Web Portal Development
```bash
cd web/portal
npm install
npm run dev
```

### iOS Development
```bash
cd ios/UserApp
open UserApp.xcworkspace
# Build and run in Xcode
```

## Testing

### API Testing
```bash
# Run Postman collection
newman run postman/citation-system.postman_collection.json

# Or use REST client files
# Open requests/ folder in VS Code with REST Client extension
```

### Unit Tests
```bash
# Run service tests
cd services/auth-svc
npm test

# Run web tests
cd web/portal
npm test
```

## API Documentation

- **Auth Service**: http://localhost:8080/auth/docs
- **Driver Service**: http://localhost:8080/driver/docs
- **Citation Service**: http://localhost:8080/citation/docs

## File Structure

```
citation-system/
├── services/
│   ├── auth-svc/          # Authentication microservice
│   ├── driver-svc/        # Driver profile & location service
│   └── citation-svc/      # Citation management service
├── web/
│   └── portal/            # Officer & Admin web app
├── ios/
│   └── UserApp/           # Native iOS app for users
├── db/
│   └── migrations/        # Database migrations
├── openapi/              # API specifications
├── infra/                # Infrastructure configuration
├── postman/              # API test collection
├── requests/             # REST client test files
└── uploads/              # Local file storage
```

## Security Features

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Password hashing with bcrypt
- File upload validation and size limits
- CORS protection
- Request rate limiting
- Input validation and sanitization

## Troubleshooting

### Common Issues

1. **Services not starting**: Check Docker logs with `docker compose logs [service-name]`
2. **Database connection errors**: Ensure PostgreSQL is running and accessible
3. **iOS app can't connect**: Update base URL and check network permissions
4. **File uploads failing**: Check upload directory permissions and disk space

### Logs
```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f auth-svc
docker compose logs -f nginx
```

### Health Checks
- Auth Service: http://localhost:8080/auth/health
- Driver Service: http://localhost:8080/driver/health
- Citation Service: http://localhost:8080/citation/health

## License

MIT License - see LICENSE file for details.