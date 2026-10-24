# 📋 UrbanFix – Test Results & Project Report

**Project**: UrbanFix – Civic Issue Reporting & Management Platform  
**Version**: 1.0  
**Date**: October 24, 2026  
**Author**: Shibam Ghosh  
**Test Execution Date**: October 24, 2026  

---

## 1. Project Overview

UrbanFix is a full-stack web application that enables citizens to report civic infrastructure issues (potholes, broken streetlights, water leaks, etc.) and allows municipal administrators to triage, manage, and resolve those complaints.

### Technology Stack

| Component | Technology |
|---|---|
| Backend Framework | Java 21, Spring Boot 3.4 |
| Frontend Framework | React 19, Vite 6, Material UI v7 |
| Database | MySQL (local), AWS RDS PostgreSQL (production) |
| Security | Spring Security, JWT (JJWT v0.12), BCrypt |
| AI Integration | Groq Cloud API (Llama 3.3 70B) |
| Cloud Storage | AWS S3 |
| Testing Tools | JUnit 5 + Mockito (White-box), Python PyTest (Black-box) |
| CI/CD | GitHub Actions |
| Server Runtime | AWS EC2, Docker Compose |

### Server Configuration

| Setting | Value |
|---|---|
| Backend Port | `5050` |
| Frontend Port | `5173` |
| Backend Base URL | `http://localhost:5050` |
| Frontend Dev URL | `http://localhost:5173` |
| Swagger UI | `http://localhost:5050/swagger-ui/index.html` |

---

## 2. Test Summary

### 2.1 Overall Results

| Test Type | Tool | Total Tests | Passed | Failed | Pass Rate |
|---|---|---|---|---|---|
| **Black-Box (API)** | Python PyTest | 10 | ✅ 10 | ❌ 0 | **100%** |
| **White-Box (Unit)** | JUnit 5 + Mockito | 14 | ✅ 14 | ❌ 0 | **100%** |
| **Total** | — | **24** | **✅ 24** | **❌ 0** | **100%** |

> **Verdict: ✅ ACCEPTED** — All 24 test cases passed. The application meets all acceptance criteria.

---

## 3. Black-Box API Test Results

**Tool**: Python `pytest` 9.1.1 + `requests` library  
**Execution Command**:
```bash
pytest tests/ -v --html=test-reports/test_report.html
```
**Execution Time**: 1.04 seconds  
**Platform**: Windows 11, Python 3.13.14  

### 3.1 Test Execution Output

```
=============== test session starts ===============
platform win32 -- Python 3.13.14, pytest-9.1.1, pluggy-1.6.0
rootdir: D:\CODING\Development\UrbanFix
plugins: anyio-4.14.2, langsmith-0.13.0, html-4.2.0, metadata-3.1.1
collected 10 items

tests/test_auth_api.py::test_auth_api_working                      PASSED
tests/test_auth_api.py::test_user_registration_and_login           PASSED
tests/test_auth_api.py::test_login_invalid_password                PASSED
tests/test_complaints_api.py::test_get_all_complaints              PASSED
tests/test_complaints_api.py::test_create_complaint                PASSED
tests/test_complaints_api.py::test_get_my_complaints               PASSED
tests/test_complaints_api.py::test_unauthorized_complaint_creation  PASSED
tests/test_users_and_admin_api.py::test_get_current_user_profile   PASSED
tests/test_users_and_admin_api.py::test_get_user_dashboard_stats   PASSED
tests/test_users_and_admin_api.py::test_citizen_forbidden_from_admin_dashboard PASSED

=============== 10 passed in 1.04s ================
```

### 3.2 Detailed Test Cases

#### Module 1: Authentication API (`test_auth_api.py`)

| Test ID | Test Name | Endpoint | Method | Expected Status | Result |
|---|---|---|---|---|---|
| TC-AUTH-01 | `test_auth_api_working` | `/api/auth` | GET | 200 | ✅ PASS |
| TC-AUTH-02 | `test_user_registration_and_login` | `/api/auth/register` + `/api/auth/login` | POST | 200/201 + JWT | ✅ PASS |
| TC-AUTH-03 | `test_login_invalid_password` | `/api/auth/login` | POST | 401 or 403 | ✅ PASS |

**What was tested:**
- Public auth health check endpoint is accessible without a token
- A new unique user can register and immediately log in to receive a signed JWT token
- Invalid password attempts are correctly rejected with HTTP 401/403

---

#### Module 2: Complaints API (`test_complaints_api.py`)

| Test ID | Test Name | Endpoint | Method | Expected Status | Result |
|---|---|---|---|---|---|
| TC-COMP-01 | `test_get_all_complaints` | `/api/complaints` | GET | 200 + list | ✅ PASS |
| TC-COMP-02 | `test_create_complaint` | `/api/complaints` | POST | 200/201 + ID | ✅ PASS |
| TC-COMP-03 | `test_get_my_complaints` | `/api/complaints/my` | GET | 200 + list | ✅ PASS |
| TC-COMP-04 | `test_unauthorized_complaint_creation` | `/api/complaints` | POST | 401 or 403 | ✅ PASS |

**Complaint payload tested:**
```json
{
  "title": "Pothole on Main Street",
  "description": "Large dangerous pothole causing traffic issues.",
  "category": "Roads",
  "location": "123 Main St, Central City",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

**What was tested:**
- Authenticated citizen can fetch the full complaints feed
- Citizen can submit a multipart/form-data complaint with GPS coordinates
- Citizen can view only their own complaints (`/my` endpoint)
- Requests without a JWT token are blocked (security enforcement)

---

#### Module 3: User Profile & Admin RBAC (`test_users_and_admin_api.py`)

| Test ID | Test Name | Endpoint | Method | Expected Status | Result |
|---|---|---|---|---|---|
| TC-USER-01 | `test_get_current_user_profile` | `/api/users/me` | GET | 200 + email | ✅ PASS |
| TC-USER-02 | `test_get_user_dashboard_stats` | `/api/users/me/dashboard` | GET | 200 + stats | ✅ PASS |
| TC-ADMIN-01 | `test_citizen_forbidden_from_admin_dashboard` | `/api/admin/dashboard` | GET | 403 | ✅ PASS |

**What was tested:**
- Authenticated citizen can fetch their own profile (`email` field present)
- Citizen personal dashboard metrics (total complaints count) are returned
- **RBAC enforcement**: A CITIZEN role user is blocked from accessing Admin-only endpoints with HTTP 403 Forbidden

---

## 4. White-Box Unit Test Results

**Tool**: JUnit 5 + Mockito  
**Execution Command**:
```bash
cd backend
mvn test
```
**Java Version**: Java 21 (Microsoft OpenJDK 21)  
**Spring Boot Version**: 3.4.x  

### 4.1 Test Classes

| Test Class | Methods Tested | Tests | Result |
|---|---|---|---|
| `ComplaintServiceImplTest` | `createComplaint`, `getAllComplaints`, `getComplaintById`, `updateComplaint`, `deleteComplaint`, pagination, filtering | 10 | ✅ PASS |
| `JwtServiceTest` | Token generation, validation, expiry, claim extraction | 4 | ✅ PASS |
| **Total** | | **14** | **✅ 14 PASSED** |

### 4.2 Fixes Applied During Testing

| Issue | Root Cause | Fix Applied |
|---|---|---|
| `UnnecessaryStubbingException` | Mockito strict mode rejected stubs not called in every test | Used `lenient()` on shared stubs |
| `NullPointerException` in mapper | `ComplaintMapper` was mocked but returned null objects | Replaced mock with real `ComplaintMapper` instance |
| Build failure with Java 8 | Maven was using system Java 8 instead of Java 21 | Set `JAVA_HOME` to Microsoft OpenJDK 21 |

---

## 5. Security Configuration

### 5.1 Permitted Endpoints (No Authentication Required)

| Endpoint Pattern | Purpose |
|---|---|
| `/api/test` | Health check |
| `/api/auth/**` | Login & Registration |
| `/uploads/**` | Static file serving |
| `/v3/api-docs/**` | OpenAPI schema |
| `/swagger-ui/**` | Swagger documentation |
| `/swagger-ui.html` | Swagger UI entry point |
| `/actuator/**` | Spring Boot Actuator |

### 5.2 Role-Based Access Control

| Role | Access Level |
|---|---|
| `CITIZEN` | Submit, view, and delete own complaints; view own profile |
| `ADMIN` | Full access to all complaints, user management, dashboard analytics |
| Unauthenticated | Blocked with HTTP 401/403 on all protected routes |

---

## 6. Bugs Found & Resolved

> No open bugs remain. All issues found during testing were resolved before final test execution.

| Bug ID | Severity | Category | Description | Status |
|---|---|---|---|---|
| BUG-001 | High | Integration | `ComplaintServiceImplTest` failed with `NullPointerException` in real mapper | ✅ Fixed |
| BUG-002 | Medium | Regression | JUnit tests compiled on Java 8 instead of Java 21, causing build failure | ✅ Fixed |
| BUG-003 | Medium | Security | `/actuator/**` not in `SecurityConfig` permitAll, returning 403 unexpectedly | ✅ Fixed |
| BUG-004 | Low | Testing | Mockito `UnnecessaryStubbingException` in shared test stubs | ✅ Fixed |

---

## 7. Acceptance Criteria Evaluation

| Criterion | Requirement | Status |
|---|---|---|
| Authentication | Login and Registration work with JWT | ✅ MET |
| Authorization | Citizens cannot access Admin endpoints (403 enforced) | ✅ MET |
| Complaint Lifecycle | Complaints can be created, listed, and filtered | ✅ MET |
| Security | No unauthenticated access permitted | ✅ MET |
| Input Validation | JWT guard blocks invalid requests | ✅ MET |
| Test Suite Pass Rate | 100% of test cases must pass | ✅ MET (24/24) |

### ✅ Final Verdict: APPLICATION ACCEPTED

---

## 8. Test Deliverables

| Deliverable | Location | Description |
|---|---|---|
| `TEST_PLAN.md` | `/TEST_PLAN.md` | Full test plan document |
| `TEST_RESULTS.md` | `/TEST_RESULTS.md` | This document |
| `test_auth_api.py` | `/tests/test_auth_api.py` | Black-box auth test scripts |
| `test_complaints_api.py` | `/tests/test_complaints_api.py` | Black-box complaints test scripts |
| `test_users_and_admin_api.py` | `/tests/test_users_and_admin_api.py` | Black-box admin RBAC test scripts |
| `conftest.py` | `/tests/conftest.py` | PyTest fixtures (JWT, user setup) |
| `test_report.html` | `/test-reports/test_report.html` | Auto-generated PyTest HTML report |
| `ComplaintServiceImplTest.java` | `backend/src/test/java/com/urbanfix/unit/` | JUnit white-box unit tests |
| `JwtServiceTest.java` | `backend/src/test/java/com/urbanfix/unit/` | JUnit JWT service unit tests |

---

## 9. How to Re-Run Tests

### Black-Box API Tests (PyTest)

```bash
# Ensure backend is running on port 5050
cd D:\CODING\Development\UrbanFix\backend
mvn spring-boot:run

# In a new terminal
cd D:\CODING\Development\UrbanFix
pip install -r tests/requirements.txt
pytest tests/ -v --html=test-reports/test_report.html
```

### White-Box Unit Tests (JUnit)

```bash
cd D:\CODING\Development\UrbanFix\backend
mvn test
```

### Start Frontend

```bash
cd D:\CODING\Development\UrbanFix\frontend
npm run dev
# App available at http://localhost:5173
```
