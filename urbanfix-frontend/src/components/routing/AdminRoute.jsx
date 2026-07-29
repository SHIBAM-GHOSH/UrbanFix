import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../../services/userService';
import ErrorAlert from '../shared/ErrorAlert';
import LoadingState from '../shared/LoadingState';

function AdminRoute() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const data = await getCurrentUser();
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Unable to verify admin access.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingState message="Checking admin access..." />;
  }

  if (error) {
    return <ErrorAlert message={error} sx={{ mx: 'auto', my: 6, width: 'min(92vw, 720px)' }} />;
  }

  if (profile?.role !== 'ADMIN') {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}

export default AdminRoute;
