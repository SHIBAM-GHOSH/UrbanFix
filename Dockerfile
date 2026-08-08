# ==========================================
# STAGE 1: Build Stage (Maven + OpenJDK 21)
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy backend source code
COPY backend/src ./src

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
