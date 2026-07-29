import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Alert, Box, CircularProgress } from '@mui/material';
import { getCurrentUser } from '../../services/userService';

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
    return (
      <Box alignItems="center" display="flex" justifyContent="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mx="auto" py={6} width="min(92vw, 720px)">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (profile?.role !== 'ADMIN') {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}

export default AdminRoute;
