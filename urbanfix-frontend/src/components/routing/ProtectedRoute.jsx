import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

function ProtectedRoute() {
  const location = useLocation();

  // Preserve the requested page so it can be restored after sign-in later.
  if (!isAuthenticated()) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
