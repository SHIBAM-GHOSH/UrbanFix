"""
==============================================================================
URBANFIX TEST FIXTURES CONFIGURATION (conftest.py)
WHAT IT DOES: Provides reusable Pytest fixtures (Base URL, Citizen credentials,
              JWT Token authentication, HTTP Headers) across all test files.
WHY IT IS HERE: Centralizes session setup so individual test files don't have
                to duplicate user creation or JWT auth request logic.
==============================================================================
"""

import pytest
import requests
import uuid

# Base target URL for the Spring Boot REST API server
BASE_URL = "http://localhost:5050"


@pytest.fixture(scope="session")
def base_url():
    """
    Component: Base API Endpoint URL
    Provides the root HTTP address of the live UrbanFix backend server.
    """
    return BASE_URL


@pytest.fixture(scope="session")
def citizen_user():
    """
    Component: Dynamic Test User Generator
    Generates a unique, non-colliding Citizen user account for each test run.
    """
    unique_id = str(uuid.uuid4())[:8]
    return {
        "fullName": f"Citizen {unique_id}",
        "email": f"citizen_{unique_id}@urbanfix.test",
        "password": "TestPassword123!",
        "role": "CITIZEN"
    }


@pytest.fixture(scope="session")
def citizen_token(base_url, citizen_user):
    """
    Component: JWT Authentication Token Provider
    Registers a new Citizen user and executes a POST /api/auth/login request 
    to obtain a real signed Bearer JWT token from Spring Security.
    """
    # Step 1: Register the new user account
    reg_res = requests.post(f"{base_url}/api/auth/register", json=citizen_user)
    assert reg_res.status_code in [200, 201], f"User registration failed: {reg_res.text}"

    # Step 2: Authenticate and fetch JWT token
    login_payload = {
        "email": citizen_user["email"],
        "password": citizen_user["password"]
    }
    login_res = requests.post(f"{base_url}/api/auth/login", json=login_payload)
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    
    token = login_res.json().get("token")
    assert token is not None, "JWT Token was not returned in login response payload"
    return token


@pytest.fixture(scope="session")
def citizen_headers(citizen_token):
    """
    Component: Authorization HTTP Header Generator
    Wraps the JWT Bearer token into standard HTTP request headers.
    """
    return {"Authorization": f"Bearer {citizen_token}"}
