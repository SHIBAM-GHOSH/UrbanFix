# 🚀 UrbanFix - Crowdsourced Civic Issue Reporting Platform

UrbanFix is a full-stack civic issue reporting platform that enables citizens to report public infrastructure problems such as potholes, garbage accumulation, water leakage, streetlight failures, and more.

The platform aims to bridge the communication gap between citizens and municipal authorities by providing a centralized system for reporting, tracking, and managing civic complaints.

> **Project Status:** 🚧 Under Active Development

---

# ✨ Features Implemented

## Authentication & Security

- User Registration
- User Login
- Password Encryption using BCrypt
- Spring Security Integration
- JWT Authentication
- JWT Authorization
- Stateless Authentication
- Protected REST APIs
- Custom UserDetailsService
- JWT Filter
- Global Exception Handling

---

## Complaint Module

Implemented

- Complaint Entity
- Complaint Repository
- Complaint DTOs
- Complaint Service Architecture

Currently in Development

- Create Complaint API
- Update Complaint API
- Delete Complaint API
- Get Complaint APIs

---

# 🚀 Planned Features

- Complaint Image Upload (Cloudinary)
- Google Maps Integration
- Geo-tagged Complaint Reporting
- Complaint Categories
- Upvote / Priority System
- Complaint Comments
- Complaint Status Tracking
- Admin Dashboard
- Analytics Dashboard
- Redis Caching
- AWS Deployment
- Docker Support

---

# 🏗️ Tech Stack

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT (JJWT)
- Maven

## Database

- MySQL

## Security

- BCrypt Password Encoder
- JWT Authentication
- Role-Based Authorization

## Tools

- Postman
- Git
- GitHub

---

# 📂 Project Structure

```
src
│
├── config
├── controller
├── dto
├── entity
├── exception
├── repository
├── security
├── service
│   └── impl
└── UrbanFixApplication.java
```

---

# 🔐 Authentication Flow

```
Client
    │
Email + Password
    │
    ▼
AuthenticationManager
    │
    ▼
CustomUserDetailsService
    │
    ▼
MySQL
    │
    ▼
JWT Generated
    │
    ▼
Client Stores JWT
    │
    ▼
Every Protected Request
    │
Bearer Token
    │
    ▼
JwtAuthenticationFilter
    │
    ▼
SecurityContext
    │
    ▼
Controller
```

---

# 📌 Current REST APIs

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |

---

# 🛠️ Upcoming APIs

## Complaints

| Method | Endpoint |
|---------|----------|
| POST | `/api/complaints` |
| GET | `/api/complaints` |
| GET | `/api/complaints/{id}` |
| PUT | `/api/complaints/{id}` |
| DELETE | `/api/complaints/{id}` |

---

# ⚙️ Running the Project

## Clone Repository

```bash
git clone https://github.com/SHIBAM-GHOSH/UrbanFix.git
```

Navigate to the project

```bash
cd UrbanFix
```

Configure MySQL

```
application.properties
```

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/urbanfix
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

jwt.secret=YOUR_SECRET_KEY
jwt.expiration=86400000
```

Run

```bash
mvn spring-boot:run
```

Application runs on

```
http://localhost:5050
```

---

# 📈 Development Roadmap

- [x] Project Setup
- [x] MySQL Configuration
- [x] User Entity
- [x] Authentication
- [x] Spring Security
- [x] JWT Authentication
- [x] Protected APIs
- [ ] Complaint CRUD
- [ ] Image Upload
- [ ] Google Maps
- [ ] Comments
- [ ] Upvotes
- [ ] Admin Dashboard
- [ ] Redis
- [ ] AWS Deployment
- [ ] Docker

---

# 👨‍💻 Author

**Shibam Ghosh**

- GitHub: https://github.com/SHIBAM-GHOSH

---

# ⭐ If you find this project useful, consider giving it a star.
