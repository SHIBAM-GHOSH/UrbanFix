"""
==============================================================================
URBANFIX AUTHENTICATION API TEST SUITE (test_auth_api.py)
WHAT IT DOES: Tests user registration, JWT login authentication, and credential validation.
WHY IT IS HERE: Validates Spring Security RBAC and JWT token generation endpoint contracts.
==============================================================================
"""

import requests
import uuid


def test_auth_api_working(base_url):
    """
    Component Test: Health check endpoint
    Verifies that the public /api/auth base endpoint is active and accessible.
    """
    res = requests.get(f"{base_url}/api/auth")
    assert res.status_code == 200
    assert "Auth API Working" in res.text


def test_user_registration_and_login(base_url):
    """
    Component Test: Registration & Login flow
    Validates creating a new user profile and successfully authenticating with valid credentials.
    """
    uid = str(uuid.uuid4())[:8]
    user_payload = {
        "fullName": f"Test User {uid}",
        "email": f"user_{uid}@urbanfix.test",
        "password": "SecurePassword123!",
        "role": "CITIZEN"
    }

    # Execute Registration request
    reg_res = requests.post(f"{base_url}/api/auth/register", json=user_payload)
    assert reg_res.status_code in [200, 201]

    # Execute Login request
    login_res = requests.post(f"{base_url}/api/auth/login", json={
        "email": user_payload["email"],
        "password": user_payload["password"]
    })
    assert login_res.status_code == 200
    assert "token" in login_res.json()


def test_login_invalid_password(base_url, citizen_user):
    """
    Component Test: Bad Credential Guard
    Verifies that Spring Security correctly rejects invalid passwords with 401/403.
    """
    res = requests.post(f"{base_url}/api/auth/login", json={
        "email": citizen_user["email"],
        "password": "WrongPassword999!"
    })
    assert res.status_code in [401, 403]
