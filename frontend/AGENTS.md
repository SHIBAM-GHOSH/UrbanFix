# UrbanFix Frontend AI Instructions

## Project Overview

Build a professional production-quality React frontend for the UrbanFix platform.

The backend is COMPLETE.

Never modify the backend.

Use ONLY the endpoints defined in openapi.json.

If an endpoint is missing, ask before implementing.

---

## Tech Stack

- React 19
- Vite
- Material UI
- React Router
- Axios
- Recharts

---

## Authentication

Use JWT.

Store JWT in localStorage.

Use an Axios interceptor to attach

Authorization: Bearer <token>

to every authenticated request.

---

## Coding Standards

- Functional Components
- React Hooks
- Reusable Components
- Clean Architecture
- Proper Error Handling
- Snackbar Notifications
- Loading Indicators
- Confirmation Dialogs

---

## UI

Professional dashboard.

Responsive.

Material UI only.

No Bootstrap.

No Tailwind.

---

## Routes

Public

- Login
- Register

Authenticated

- Dashboard
- Complaints
- Complaint Details
- Create Complaint
- Edit Complaint

Admin

- Admin Dashboard
- Complaint Management
- Analytics

---

## Rules

Never invent APIs.

Never modify openapi.json.

Never generate placeholder backend code.

Always verify imports.

Always ensure the project builds successfully after every feature.

Implement ONE feature at a time.

Wait for approval before moving to the next feature.