"""
==============================================================================
URBANFIX USER PROFILE & ADMIN RBAC TEST SUITE (test_users_and_admin_api.py)
WHAT IT DOES: Tests profile queries, user statistics, and Role-Based Access Control (RBAC).
WHY IT IS HERE: Guarantees that regular citizens cannot access sensitive Admin dashboard APIs.
==============================================================================
"""

import requests


def test_get_current_user_profile(base_url, citizen_headers):
    """
    Component Test: Authenticated User Profile
    Verifies fetching current authenticated user profile details (/api/users/me).
    """
    res = requests.get(f"{base_url}/api/users/me", headers=citizen_headers)
    assert res.status_code == 200
    data = res.json()
    assert "email" in data


def test_get_user_dashboard_stats(base_url, citizen_headers):
    """
    Component Test: User Personal Dashboard Metrics
    Verifies fetching user-specific counts (total submitted complaints).
    """
    res = requests.get(f"{base_url}/api/users/me/dashboard", headers=citizen_headers)
    assert res.status_code == 200
    data = res.json()
    assert "totalComplaints" in data


def test_citizen_forbidden_from_admin_dashboard(base_url, citizen_headers):
    """
    Component Test: RBAC Authorization Guard
    Confirms that a CITIZEN role user is BLOCKED (403 Forbidden) from accessing Admin dashboards.
    """
    res = requests.get(f"{base_url}/api/admin/dashboard", headers=citizen_headers)
    assert res.status_code == 403
