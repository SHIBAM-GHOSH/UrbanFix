import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UserDashboardPage from './pages/dashboard/UserDashboardPage';
import ComplaintListPage from './pages/complaints/ComplaintListPage';
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
          </Route>
        </Route>
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
