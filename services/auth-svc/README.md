# Auth Service

Authentication and user management microservice for the Citation Management System.

## Features

- **JWT Authentication**: Access tokens with refresh token rotation
- **Role-Based Access Control**: Support for admin, officer, and user roles
- **Password Security**: Bcrypt hashing with configurable rounds
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive request validation with Joi
- **API Documentation**: Auto-generated Swagger/OpenAPI docs
- **Database Migrations**: Structured schema management
- **Health Checks**: Built-in health monitoring endpoints

## Quick Start

### Development Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Required |
| `JWT_EXPIRES_IN` | Access token expiration | `1h` |
| `REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` |
| `LOG_LEVEL` | Logging level | `info` |

## API Endpoints

### Authentication

- `POST /v1/auth/register` - Register new user
- `POST /v1/auth/login` - User login
- `POST /v1/auth/refresh` - Refresh access token
- `POST /v1/auth/logout` - Logout user
- `POST /v1/auth/logout-all` - Logout from all devices
- `POST /v1/auth/change-password` - Change password

### User Management

- `GET /v1/auth/profile` - Get user profile
- `GET /v1/auth/users` - List users (Admin only)

### System

- `GET /health` - Health check
- `GET /docs` - API documentation

## Database Schema

The service uses the `auth` schema with the following tables:

- `users` - User accounts and profiles
- `refresh_tokens` - Refresh token storage
- `migrations` - Migration tracking

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Security Features

- **JWT with RS256**: Secure token signing
- **Refresh Token Rotation**: Enhanced security for long-lived sessions
- **Rate Limiting**: Protection against abuse
- **Password Requirements**: Strong password policy
- **CORS Protection**: Configurable origin whitelist
- **Helmet Security**: Standard security headers
- **Input Sanitization**: SQL injection prevention

## Role-Based Access Control

### Roles

- **admin**: Full system access, user management
- **officer**: Citation management, limited user access
- **user**: Personal profile and citation viewing only

### Authorization Middleware

```typescript
// Protect endpoint for specific roles
router.get('/admin-only', authenticate, authorize(['admin']), handler);
```

## Error Handling

The service returns consistent error responses:

```json
{
  "error": "Error message",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## Logging

Uses Winston for structured logging with different levels:

- **error**: Error conditions
- **warn**: Warning conditions  
- **info**: Informational messages
- **debug**: Debug messages

## Health Monitoring

Health check endpoint provides service status:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2023-07-15T10:30:00.000Z",
  "service": "auth-svc"
}
```