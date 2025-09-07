FROM openjdk:21-jdk-slim

LABEL maintainer="Traafik Team"
LABEL description="Traafik Backend API"

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy gradle wrapper and build files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Copy source code
COPY src src

# Make gradlew executable
RUN chmod +x gradlew

# Build the application
RUN ./gradlew build -x test --no-daemon

# Create non-root user
RUN groupadd -r traafik && useradd -r -g traafik traafik
RUN chown -R traafik:traafik /app
USER traafik

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/actuator/health || exit 1

# Run the application
CMD ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "build/libs/traafik-backend-1.0.0.jar"]