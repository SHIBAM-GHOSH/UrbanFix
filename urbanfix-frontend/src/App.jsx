import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UserDashboardPage from './pages/dashboard/UserDashboardPage';
import ComplaintListPage from './pages/complaints/ComplaintListPage';
import CreateComplaintPage from './pages/complaints/CreateComplaintPage';
import ComplaintDetailPage from './pages/complaints/ComplaintDetailPage';
import EditComplaintPage from './pages/complaints/EditComplaintPage';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/routing/ProtectedRoute';

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
          </Route>
        </Route>
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
