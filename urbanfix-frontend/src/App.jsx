import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UserDashboardPage from './pages/dashboard/UserDashboardPage';
import ComplaintListPage from './pages/complaints/ComplaintListPage';
import CreateComplaintPage from './pages/complaints/CreateComplaintPage';
import ComplaintDetailPage from './pages/complaints/ComplaintDetailPage';
import EditComplaintPage from './pages/complaints/EditComplaintPage';
import ProfilePage from './pages/profile/ProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminComplaintManagementPage from './pages/admin/AdminComplaintManagementPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import NotFoundPage from './pages/shared/NotFoundPage';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';

function App() {
  return (
    <BrowserRouter>
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
              <Route element={<AdminAnalyticsPage />} path="/admin/analytics" />
            </Route>
          </Route>
        </Route>
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

