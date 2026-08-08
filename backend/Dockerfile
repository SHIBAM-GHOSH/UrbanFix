# ==========================================
# STAGE 1: Build Stage (Maven + OpenJDK 21)
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy dependency definition file first to leverage Docker layer caching
COPY pom.xml .

# Download dependencies (offline mode to cache layers)
RUN mvn dependency:go-offline -B

# Copy application source code
COPY src ./src

# Build production JAR package, skipping unit tests for fast build
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Lightweight Production Runtime
# ==========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create uploads directory for image storage
RUN mkdir -p /app/uploads

# Copy compiled JAR file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose fallback application port
EXPOSE 5050

# Run Spring Boot executable JAR
ENTRYPOINT ["java", "-jar", "app.jar"]

