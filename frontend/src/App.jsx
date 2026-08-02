import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';
import LoadingState from './components/shared/LoadingState';

// Lazy-loaded pages for optimal bundle chunking
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const UserDashboardPage = lazy(() => import('./pages/dashboard/UserDashboardPage'));
const ComplaintListPage = lazy(() => import('./pages/complaints/ComplaintListPage'));
const CreateComplaintPage = lazy(() => import('./pages/complaints/CreateComplaintPage'));
const ComplaintDetailPage = lazy(() => import('./pages/complaints/ComplaintDetailPage'));
const EditComplaintPage = lazy(() => import('./pages/complaints/EditComplaintPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminComplaintManagementPage = lazy(() => import('./pages/admin/AdminComplaintManagementPage'));
const NotFoundPage = lazy(() => import('./pages/shared/NotFoundPage'));

import GoogleMapsProvider from './components/maps/GoogleMapsProvider';

function App() {
  return (
    <BrowserRouter>
      <GoogleMapsProvider>
        <Suspense fallback={<LoadingState message="Loading UrbanFix..." minHeight="70vh" />}>
        <Routes>
          <Route element={<Navigate replace to="/login" />} path="/" />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route element={<UserDashboardPage />} path="/dashboard" />
              <Route element={<ComplaintListPage />} path="/complaints" />
              <Route element={<CreateComplaintPage />} path="/complaints/new" />
              <Route element={<ComplaintDetailPage />} path="/complaints/:complaintId" />
              <Route element={<EditComplaintPage />} path="/complaints/:complaintId/edit" />
              <Route element={<ProfilePage />} path="/profile" />
              <Route element={<AdminRoute />}>
                <Route element={<AdminDashboardPage />} path="/admin" />
                <Route element={<AdminComplaintManagementPage />} path="/admin/complaints" />
              </Route>
            </Route>
          </Route>
          <Route element={<NotFoundPage />} path="*" />
        </Routes>
      </Suspense>
      </GoogleMapsProvider>
    </BrowserRouter>
  );
}

export default App;
