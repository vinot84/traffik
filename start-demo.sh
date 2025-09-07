#!/bin/bash

# Traafik Full-Stack Demo Setup Script for macOS
# This script sets up and runs the complete Traafik application locally

set -e

echo "🚀 Setting up Traafik Full-Stack Demo..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

print_success "Docker is running ✓"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found. Please run this script from the traafik-app directory."
    exit 1
fi

print_status "Starting Traafik services with Docker Compose..."

# Start services in background
docker-compose up -d

print_status "Waiting for services to be ready..."

# Wait for PostgreSQL
print_status "Waiting for PostgreSQL..."
timeout=60
counter=0
while ! docker-compose exec -T postgres pg_isready -U traafik -d traafik >/dev/null 2>&1; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        print_error "PostgreSQL failed to start within $timeout seconds"
        exit 1
    fi
done
print_success "PostgreSQL is ready ✓"

# Wait for Redis
print_status "Waiting for Redis..."
timeout=30
counter=0
while ! docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        print_error "Redis failed to start within $timeout seconds"
        exit 1
    fi
done
print_success "Redis is ready ✓"

# Wait for backend to be ready
print_status "Waiting for backend API..."
timeout=120
counter=0
while ! curl -s http://localhost:8080/api/v1/actuator/health >/dev/null 2>&1; do
    sleep 3
    counter=$((counter + 3))
    if [ $counter -ge $timeout ]; then
        print_warning "Backend API is taking longer than expected..."
        print_status "Checking backend logs..."
        docker-compose logs backend | tail -20
        break
    fi
done

# Check if backend is running
if curl -s http://localhost:8080/api/v1/actuator/health >/dev/null 2>&1; then
    print_success "Backend API is ready ✓"
else
    print_warning "Backend API might still be starting up"
fi

echo ""
echo "🎉 Traafik Demo is ready!"
echo ""
echo "📱 Frontend Options:"
echo "   • Quick Demo (no setup): open standalone.html"
echo "   • Full React App: http://localhost:3000 (if running)"
echo ""
echo "🔧 Backend Services:"
echo "   • API Server: http://localhost:8080/api/v1"
echo "   • API Documentation: http://localhost:8080/swagger-ui.html"
echo "   • Health Check: http://localhost:8080/api/v1/actuator/health"
echo ""
echo "🗄️  Database & Tools:"
echo "   • PostgreSQL: localhost:5432 (user: traafik, password: traafik123)"
echo "   • Redis: localhost:6379"
echo "   • MinIO (S3): http://localhost:9001 (admin/admin123)"
echo "   • MailHog: http://localhost:8025"
echo ""
echo "📊 Monitoring:"
echo "   • Prometheus: http://localhost:9090"
echo "   • Grafana: http://localhost:3001 (admin/admin123)"
echo ""
echo "🧪 Test the API:"
echo "   curl -X POST http://localhost:8080/api/v1/auth/register \\"
echo "        -H 'Content-Type: application/json' \\"
echo "        -d '{\"email\":\"demo@traafik.com\",\"password\":\"password123\",\"firstName\":\"Demo\",\"lastName\":\"User\",\"role\":\"DRIVER\"}'"
echo ""
echo "📝 View Logs:"
echo "   docker-compose logs -f [service-name]"
echo ""
echo "🛑 Stop Demo:"
echo "   docker-compose down"
echo ""

# Open standalone demo
if command -v open >/dev/null 2>&1; then
    print_status "Opening standalone demo..."
    open standalone.html
fi

print_success "Demo setup complete! 🚓✨"