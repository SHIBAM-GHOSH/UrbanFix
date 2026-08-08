# ==========================================
# STAGE 1: Build Stage (Maven + OpenJDK 21)
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy repository files
COPY . .

# Build production JAR package regardless of whether build context is root or backend directory
RUN if [ -f pom.xml ]; then \
      mvn clean package -DskipTests && cp target/*.jar app.jar; \
    elif [ -f backend/pom.xml ]; then \
      cd backend && mvn clean package -DskipTests && cp target/*.jar /app/app.jar; \
    fi

# ==========================================
# STAGE 2: Lightweight Production Runtime
# ==========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create uploads directory for image storage
RUN mkdir -p /app/uploads

# Copy compiled JAR file from builder stage
COPY --from=builder /app/app.jar app.jar

# Expose default port
EXPOSE 5050

# Run Spring Boot executable JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
