# 🧪 UrbanFix – Software Test Plan

**Project**: UrbanFix – Civic Issue Reporting & Management Platform  
**Version**: 1.0  
**Date**: October 2026  
**Author**: Shibam Ghosh  

---

## 1. Project Overview

UrbanFix is a full-stack web application built with **Spring Boot 3 (Java 21)** on the backend and **React 19 + Vite** on the frontend. It allows citizens to report civic infrastructure issues (potholes, broken streetlights, water leaks, etc.) and enables municipal administrators to triage, manage, and resolve those complaints.

### 1.1 Environment Changes
- Redis caching layer has been removed from the backend.
- All `@Cacheable`, `@CacheEvict`, and related annotations/configuration were deleted.
- CI/CD pipeline and existing PyTest suite remain unchanged.

**System Environment / Platform:**

| Component | Technology |
|---|---|
| Backend Framework | Java 21, Spring Boot 3.4 |
| Frontend Framework | React 19, Vite 6, Material UI v7 |
| Database | MySQL (local), AWS RDS PostgreSQL (production) |
| Security | Spring Security, JWT (JJWT v0.12), BCrypt |
| AI Integration | Groq Cloud API (Llama 3.3 70B) |
| Cloud Storage | AWS S3 |
| Testing Tools | JUnit 5, Mockito (White-box), Python PyTest (Black-box) |
| CI/CD | GitHub Actions |
| Server Runtime | AWS EC2, Docker Compose |

---

## 2. Scope of Testing

### 2.1 Features to Be Tested

| # | Feature | Test Type |
|---|---|---|
| 1 | User Registration | Black-box, Integration |
| 2 | User Login & JWT Authentication | Black-box, Integration |
| 3 | JWT Token Validation & Expiry | White-box, Unit |
| 4 | Role-Based Access Control (RBAC) | Black-box, Integration |
| 5 | Submit Civic Complaint (with/without photo) | Black-box, Integration |
| 6 | Fetch All Complaints (with filters) | Black-box, Integration |
| 7 | Fetch My Complaints (citizen's own) | Black-box, Integration |
| 8 | Update Complaint Details | Black-box, Integration |
| 9 | Delete Complaint (owner or admin) | Black-box, Integration |
| 10 | Admin Status Update (PENDING → RESOLVED) | Black-box, Integration |
| 11 | Admin Dashboard Statistics | Black-box, Integration |
| 12 | Category Analytics API | Black-box, Integration |
| 13 | Complaint Service Business Logic | White-box, Unit |
| 14 | AI Complaint Classification (Groq) | White-box, Unit |
| 15 | Input Validation & Error Handling | Black-box |

- Cache‑related functionality is out of scope because Redis caching has been removed.

### 2.2 Features NOT in Scope

- Frontend UI visual rendering (layout and styling)
- AWS S3 real file upload (mocked in unit tests)
- Google Maps API tile rendering
- Load / Performance testing

---

## 3. Bug Taxonomy

All identified defects are classified using the following taxonomy:

| Bug Category | Description | Example |
|---|---|---|
| **Functional** | Feature does not behave as expected | Login returns 200 with wrong password |
| **Security** | Unauthorized access or data exposure | Citizen accessing admin endpoint without 403 |
| **Validation** | Missing or incorrect input validation | Empty email accepted at registration |
| **Data Integrity** | Incorrect data stored or retrieved | Complaint stored with null category |
| **Authorization** | RBAC rules violated | Citizen deleting another user's complaint |
| **Integration** | Failure in communication between components | AI service returns null, complaint rejected |
| **Boundary** | Failure at edge values | Latitude value outside -90 to +90 accepted |
| **Regression** | Previously working feature broken by new code | Login broken after adding caching |

### Bug Severity Levels

| Severity | Definition |
|---|---|
| **Critical** | Application crash, data loss, security breach |
| **High** | Core feature completely broken |
| **Medium** | Feature works partially or with workaround |
| **Low** | Minor UI or cosmetic issue |

---

## 4. Test Scenarios & Test Cases

### 4.1 Authentication Module

| Test ID | Test Scenario | Input | Expected Output | Pass/Fail Criteria |
|---|---|---|---|---|
| TC-AUTH-01 | Register new user with valid data | `fullName`, `email`, `password` | HTTP 200 + "User Registered Successfully" | PASS if 200 returned |
| TC-AUTH-02 | Register with duplicate email | Existing email | HTTP 409 Conflict | PASS if 409 returned |
| TC-AUTH-03 | Login with valid credentials | Correct email & password | HTTP 200 + JWT token in response | PASS if token present |
| TC-AUTH-04 | Login with wrong password | Valid email, wrong password | HTTP 401 or 403 | PASS if 401/403 returned |
| TC-AUTH-05 | Login with non-existent email | Unknown email | HTTP 401 or 403 | PASS if 401/403 returned |
| TC-AUTH-06 | Register with blank fullName | `fullName: ""` | HTTP 400 Validation error | PASS if 400 returned |

---

### 4.2 Complaints Module

| Test ID | Test Scenario | Input | Expected Output | Pass/Fail Criteria |
|---|---|---|---|---|
| TC-COMP-01 | Citizen creates complaint with valid data | Multipart form with title, description, category, GPS | HTTP 201 + Complaint JSON with ID | PASS if 201 + ID returned |
| TC-COMP-02 | Citizen creates complaint without JWT token | No Authorization header | HTTP 401 or 403 | PASS if 401/403 returned |
| TC-COMP-03 | Fetch all complaints (authenticated) | Valid JWT | HTTP 200 + List of complaints | PASS if 200 + list returned |
| TC-COMP-04 | Fetch own complaints | Valid Citizen JWT | HTTP 200 + only own complaints | PASS if 200 returned |
| TC-COMP-05 | Fetch complaint by ID | Valid complaint ID | HTTP 200 + single complaint | PASS if 200 returned |
| TC-COMP-06 | Delete own complaint | Owner JWT + complaint ID | HTTP 200 "deleted successfully" | PASS if 200 returned |
| TC-COMP-07 | Delete another user's complaint | Different citizen JWT | HTTP 403 Forbidden | PASS if 403 returned |

---

### 4.3 Admin Module

| Test ID | Test Scenario | Input | Expected Output | Pass/Fail Criteria |
|---|---|---|---|---|
| TC-ADMIN-01 | Citizen accesses admin dashboard | Citizen JWT | HTTP 403 Forbidden | PASS if 403 returned |
| TC-ADMIN-02 | Admin fetches all complaints | Admin JWT | HTTP 200 + full complaint list | PASS if 200 returned |
| TC-ADMIN-03 | Admin updates complaint status to RESOLVED | Admin JWT + complaint ID | HTTP 200 + updated complaint | PASS if status = RESOLVED |
| TC-ADMIN-04 | Admin gets dashboard statistics | Admin JWT | HTTP 200 + `totalComplaints`, `pendingComplaints` fields | PASS if fields present |
| TC-ADMIN-05 | Admin gets category analytics | Admin JWT | HTTP 200 + category breakdown list | PASS if 200 + list returned |

---

## 5. Test Types & Tools

### 5.1 Black-Box Testing (Behavioral / API Level)

- **Tool**: Python `pytest` + `requests` library
- **Location**: `tests/` directory
- **Coverage**: All REST API endpoints tested as external black-box
- **Report**: `pytest tests/ -v --html=test_report.html`

### 5.2 White-Box Testing (Internal Logic / Unit Level)

- **Tool**: JUnit 5 + Mockito (Spring Boot Test)
- **Location**: `backend/src/test/java/com/urbanfix/`
- **Coverage**:
  - `ComplaintServiceImpl` business logic (mocked DB)
  - `JwtService` token generation and validation
  - `AuthServiceImpl` password encoding verification
  - `AiServiceImpl` AI classification null handling

---

## 6. Test Execution & Pass/Fail Criteria

### Black-Box (PyTest) Execution

```bash
# Install dependencies
pip install -r tests/requirements.txt

# Run all tests with HTML report
pytest tests/ -v --html=test_report.html
```

**Pass Criteria**: All 10 test cases return expected HTTP status codes.  
**Fail Criteria**: Any test returns unexpected status code or raises an exception.

---

### White-Box (JUnit) Execution

```bash
cd backend
# No Redis container needed
mvn test
```

**Pass Criteria**: All unit tests build and pass with 0 failures.  
**Fail Criteria**: Any assertion failure or exception thrown.

---

## 7. Application Acceptance Criteria

The application is considered **ACCEPTED** if:

| Criterion | Requirement |
|---|---|
| Authentication | Login and Registration work correctly with JWT |
| Authorization | Citizens cannot access Admin endpoints (403 enforced) |
| Complaint Lifecycle | Complaints can be created, fetched, updated, and deleted |
| Admin Triage | Status can be updated from PENDING → IN_PROGRESS → RESOLVED |
| Input Validation | All blank/invalid inputs are rejected with HTTP 400 |
| Security | No unauthenticated endpoint access is permitted |
| Test Suite Pass Rate | **100% of test cases must pass** |

The application is **REJECTED** if:

- Any security endpoint is accessible without a valid JWT.
- A Citizen can perform Admin-only operations.
- Core CRUD operations on complaints fail.
- More than 0 Critical or High severity bugs remain open.

---

## 8. Test Deliverables

| Deliverable | Description |
|---|---|
| `TEST_PLAN.md` | This document |
| `tests/test_auth_api.py` | Black-box auth test scripts |
| `tests/test_complaints_api.py` | Black-box complaints test scripts |
| `tests/test_users_and_admin_api.py` | Black-box admin RBAC test scripts |
| `test_report.html` | Auto-generated pytest HTML report |
| JUnit test classes | White-box unit tests in Spring Boot |
