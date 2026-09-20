"""
==============================================================================
URBANFIX CIVIC COMPLAINTS API TEST SUITE (test_complaints_api.py)
WHAT IT DOES: Tests complaint submission, listing feeds, user filter parameters, and auth guards.
WHY IT IS HERE: Validates the core business functionality of complaint reporting and GIS mapping.
==============================================================================
"""

import requests


def test_get_all_complaints(base_url, citizen_headers):
    """
    Component Test: Public Complaints Feed
    Verifies that authenticated users can retrieve the civic complaints feed.
    """
    # Fix 1: Added headers=citizen_headers to satisfy Spring Security
    res = requests.get(f"{base_url}/api/complaints", headers=citizen_headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_create_complaint(base_url, citizen_headers):
    """
    Component Test: Multipart Complaint Creation
    Validates submitting a new complaint with title, description, category, and GPS coordinates.
    """
    form_data = {
        "title": "Pothole on Main Street",
        "description": "Large dangerous pothole causing traffic issues.",
        "category": "Roads",
        "location": "123 Main St, Central City",
        "latitude": 37.7749,
        "longitude": -122.4194
    }

    # Fix 2: Formatted payload as multipart/form-data using files parameter
    multipart_data = {k: (None, str(v)) for k, v in form_data.items()}
    res = requests.post(f"{base_url}/api/complaints", files=multipart_data, headers=citizen_headers)
    assert res.status_code in [200, 201], f"Failed to create complaint: {res.text}"
    
    data = res.json()
    assert data["title"] == form_data["title"]
    assert "id" in data


def test_get_my_complaints(base_url, citizen_headers):
    """
    Component Test: Personal Complaint History
    Verifies that authenticated citizens can query their own submitted complaints.
    """
    res = requests.get(f"{base_url}/api/complaints/my", headers=citizen_headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_unauthorized_complaint_creation(base_url):
    """
    Component Test: Security Protection Guard
    Verifies that requests without a valid Bearer JWT token are rejected (HTTP 401/403).
    """
    multipart_data = {"title": (None, "Unauthorized Issue")}
    res = requests.post(f"{base_url}/api/complaints", files=multipart_data)
    assert res.status_code in [401, 403]
