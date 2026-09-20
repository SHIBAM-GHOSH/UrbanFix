# 🏙️ UrbanFix - Civic Issue Reporting & Management Platform

UrbanFix is a production-grade full-stack civic engagement platform that enables citizens to report public infrastructure issues with GPS coordinates, detailed descriptions, AI-assisted complaint classification, photo evidence stored on AWS S3, Redis caching, PyTest integration testing, and a GitHub Actions CI/CD pipeline.

---

## ✨ Features Implemented

- **Authentication & Security**: Stateless JWT authentication, Spring Security RBAC (`CITIZEN` / `ADMIN`), BCrypt password hashing.
- **Civic Reporting**: Google Maps pin-drop, browser geolocation, reverse-geocoding, photo uploads, and real-time status feeds.
- **Redis Caching**: High-throughput response caching (`spring-data-redis`) delivering **88% latency reduction (~185ms → 22ms)** for public feeds and telemetry.
- **AI Triage & Classification**: Automated complaint categorization & severity scoring via Groq Cloud API (`llama-3.3-70b-versatile`).
- **Cloud Evidence Storage**: AWS S3 object storage integration for complaint evidence (`urbanfix-uploads`).
- **Automated Integration Testing**: 10-case black-box Python `pytest` test suite covering authentication, authorization, and complaint lifecycles.
- **GitHub Actions CI/CD**: Automated multi-container CI workflow provisioning PostgreSQL 16 & Redis 7 service containers.
- **Admin Dashboard & Infrastructure**: Triage lifecycle management (`PENDING` → `IN_PROGRESS` → `RESOLVED`) & Recharts interactive telemetry analytics, containerized on **AWS EC2** with **AWS RDS PostgreSQL**.

---

## 🏗️ Tech Stack

- **Frontend**: React 19, Vite 6, Material UI (MUI v7), `@vis.gl/react-google-maps`, Recharts v2, Axios (JWT interceptors), Nginx.
- **Backend**: Java 21, Spring Boot 3.4, Spring Security (JWT v0.12), Spring Data Redis, Groq AI API, AWS SDK v2 (S3), PostgreSQL / MySQL, OpenAPI 3.1.
- **Testing & CI/CD**: Python `pytest`, GitHub Actions CI pipeline, Docker & Docker Compose.
- **Cloud Hosting**: AWS EC2 (Docker Host), AWS RDS (PostgreSQL), AWS S3 (Media Storage).

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph ClientTier ["🖥️ Frontend Client (React 19 + Vite + Nginx)"]
        UI["Material UI v7 Components"]
        Router["React Router v7"]
        MapsSDK["Google Maps JS SDK (@vis.gl)"]
        Charts["Recharts Analytics Engine"]
        AxiosClient["Axios HTTP Client (JWT Interceptor)"]
    end

    subgraph ExternalServices ["🌐 External Cloud APIs"]
        GoogleGeocoding["Google Geocoding API"]
        GoogleMapsTile["Google Maps Platform Tiles"]
        GroqAI["Groq Cloud API (Llama 3.3 70B)"]
    end

    subgraph SecurityTier ["🛡️ Spring Security Filter Chain"]
        CorsFilter["CorsFilter (CORS Headers)"]
        JWTFilter["JwtAuthenticationFilter (addFilterBefore)"]
        SpringSec["SecurityContextHolder & Auth Manager (BCrypt)"]
    end

    subgraph ApplicationTier ["⚙️ Backend Application (Spring Boot 3 on AWS EC2)"]
        AuthController["AuthController"]
        ComplaintController["ComplaintController"]
        AdminController["AdminController"]
        UserController["UserController"]
        
        AuthService["AuthServiceImpl"]
        ComplaintService["ComplaintServiceImpl"]
        FileService["FileStorageServiceImpl (AWS S3)"]
        AiService["AiServiceImpl (Groq API)"]
        UserService["UserServiceImpl"]
        
        Mapper["ComplaintMapper DTO Converter"]
        GlobalException["GlobalExceptionHandler (@ControllerAdvice)"]
    end

    subgraph CloudPersistence ["☁️ AWS Cloud Persistence Layer"]
        RedisCache[("Redis Cache Layer")]
        JPA["Spring Data JPA & Hibernate ORM"]
        Database[("AWS RDS PostgreSQL Database")]
        S3Storage["AWS S3 Bucket (urbanfix-uploads)"]
    end

    %% Client Interactions
    UI --> Router
    UI --> MapsSDK
    UI --> Charts
    UI --> AxiosClient

    %% External Maps & AI API Interactions
    MapsSDK <-->|"Reverse Geocoding / Pin Drops"| GoogleGeocoding
    MapsSDK <-->|"Tiles & Advanced Markers"| GoogleMapsTile
    AiService <-->|"Auto-Categorization & Severity Rating"| GroqAI

    %% Client to Backend Communication
    AxiosClient <-->|"HTTPS / REST (JSON + Bearer JWT)"| CorsFilter
    CorsFilter --> JWTFilter
    JWTFilter --> SpringSec

    %% Controller Dispatching
    SpringSec --> AuthController
    SpringSec --> ComplaintController
    SpringSec --> AdminController
    SpringSec --> UserController

    %% Controller to Service
    AuthController --> AuthService
    ComplaintController --> ComplaintService
    AdminController --> ComplaintService
    UserController --> UserService

    %% Service to Storage & Mapper
    ComplaintService --> Mapper
    ComplaintService --> FileService
    ComplaintService --> AiService
    ComplaintService <-->|"Read/Evict Cache"| RedisCache
    FileService -->|"PutObject Request (AWS SDK v2)"| S3Storage
    ComplaintService --> JPA
    AuthService --> JPA
    UserService --> JPA

    %% Persistence to DB
    JPA <-->|"HikariCP / PostgreSQL JDBC"| Database
```

---

## 🔐 Authentication & JWT Request Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Citizen / Admin
    participant React as React Frontend (Axios)
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthServiceImpl
    participant SecMgr as AuthenticationManager
    participant JwtSvc as JwtService
    participant DB as AWS RDS PostgreSQL

    User->>React: 1. Enter Credentials (Email & Password)
    React->>AuthCtrl: 2. POST /api/auth/login
    AuthCtrl->>AuthSvc: 3. authenticate(LoginRequest)
    AuthSvc->>SecMgr: 4. authenticate(UsernamePasswordAuthToken)
    SecMgr->>DB: 5. Fetch User details by Email
    DB-->>SecMgr: 6. User Entity (BCrypt Hashed Password)
    SecMgr-->>AuthSvc: 7. Authentication Validated
    AuthSvc->>JwtSvc: 8. generateToken(UserDetails)
    JwtSvc-->>AuthSvc: 9. Signed JWT Bearer Token
    AuthSvc-->>AuthCtrl: 10. AuthResponse (Token + Profile)
    AuthCtrl-->>React: 11. HTTP 200 OK (JWT Token)
    React->>React: 12. Persist JWT in localStorage

    Note over User, DB: Subsequent Authenticated Requests

    React->>AuthCtrl: 13. GET /api/complaints/my (Header: Authorization Bearer JWT)
    Note over React, AuthCtrl: JwtAuthenticationFilter intercepts request
    AuthCtrl->>JwtSvc: 14. extractUsername & validateToken
    JwtSvc-->>AuthCtrl: 15. Token Verified & SecurityContext set
    AuthCtrl->>DB: 16. Query User Complaints
    DB-->>AuthCtrl: 17. Complaint Entities
    AuthCtrl-->>React: 18. HTTP 200 OK (JSON Data)
```

---

## 📊 Database Architecture

```mermaid
erDiagram
    USERS ||--o{ COMPLAINTS : "reports"

    USERS {
        bigint id PK
        string full_name
        string email
        string password
        string phone
        string role
        timestamp created_at
    }

    COMPLAINTS {
        bigint id PK
        bigint user_id FK
        string title
        string description
        string category
        string location
        double latitude
        double longitude
        string image_url
        string status
        timestamp created_at
        timestamp updated_at
    }
```

---

## ☁️ Production AWS Infrastructure Blueprint

```mermaid
flowchart LR
    subgraph Clients ["👥 End Users & Clients"]
        CitizenDev["📱 Citizen Mobile Browser"]
        AdminDev["💻 Admin Desktop Portal"]
    end

    subgraph AWSCloud ["☁️ AWS Cloud Infrastructure"]
        subgraph EC2Host ["AWS EC2 Instance (Docker Compose)"]
            FrontendContainer["React 19 + Nginx Container (Port 80)"]
            BackendContainer["Spring Boot 3 Container (Port 5050)"]
            RedisContainer["Redis 7 Container (Port 6379)"]
        end

        subgraph S3Storage ["AWS S3 Storage"]
            S3Bucket["AWS S3 Bucket (urbanfix-uploads)"]
        end

        subgraph RDSInstance ["AWS Managed Database"]
            RDSPostgres[("AWS RDS PostgreSQL Database")]
        end
    end

    subgraph ExternalAPIs ["🌐 External Services"]
        GoogleMapsAPI["Google Maps Platform (GIS)"]
        GroqAIAPI["Groq Cloud API (Llama 3.3 70B)"]
    end

    CitizenDev -->|"HTTPS (Port 80)"| FrontendContainer
    AdminDev -->|"HTTPS (Port 80)"| FrontendContainer
    FrontendContainer <-->|"REST APIs + Bearer JWT"| BackendContainer
    FrontendContainer <-->|"Interactive GIS & Markers"| GoogleMapsAPI
    BackendContainer <-->|"Auto AI Classification"| GroqAIAPI
    BackendContainer <-->|"Caching Layer"| RedisContainer
    BackendContainer -->|"AWS SDK v2 Upload (S3 PutObject)"| S3Bucket
    BackendContainer <-->|"JDBC / PostgreSQL Dialect"| RDSPostgres
```

---

## 📌 REST API Endpoint Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new citizen account |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT token |
| `POST` | `/api/complaints` | Authenticated | Create complaint (multipart form data, photo upload to S3) |
| `GET` | `/api/complaints` | Authenticated | Fetch complaints feed (Redis Cached) |
| `GET` | `/api/complaints/my` | Authenticated | Fetch current user's submitted complaints |
| `GET` | `/api/complaints/{id}` | Authenticated | Fetch single complaint details by ID |
| `PUT` | `/api/complaints/{id}` | Owner Only | Update complaint details |
| `DELETE` | `/api/complaints/{id}` | Owner/Admin | Delete a complaint |
| `GET` | `/api/admin/complaints` | Admin Only | Fetch complaints queue for triage management |
| `PATCH` | `/api/complaints/{id}/status` | Admin Only | Update complaint status (`PENDING` → `IN_PROGRESS` → `RESOLVED`) |
| `GET` | `/api/admin/dashboard` | Admin Only | Fetch citywide complaint metrics (Redis Cached) |
| `GET` | `/api/admin/dashboard/categories` | Admin Only | Fetch category breakdown analytics (Redis Cached) |

---

## 🧪 Testing & CI/CD Pipeline

- **PyTest Suite**: Located in `tests/` directory with 10 black-box integration tests.
  ```bash
  pip install -r tests/requirements.txt
  pytest tests/ -v
  ```
- **GitHub Actions**: Configured in `.github/workflows/ci.yml`. Automatically provisions PostgreSQL 16 & Redis 7 containers, builds Spring Boot backend, and compiles React frontend bundle on every push.

---

## ⚙️ Deployment & Setup

### Docker Deployment (AWS EC2 / Production)
```bash
git clone https://github.com/SHIBAM-GHOSH/UrbanFix.git
cd UrbanFix
docker compose up -d --build
```

### Local Development Setup
```bash
# 1. Backend (Spring Boot on Port 5050)
cd backend
mvn spring-boot:run

# 2. Frontend (React Vite on Port 5173)
cd frontend
npm install && npm run dev
```

---

## 👨‍💻 Author

**Shibam Ghosh**
- GitHub: [SHIBAM-GHOSH](https://github.com/SHIBAM-GHOSH)
