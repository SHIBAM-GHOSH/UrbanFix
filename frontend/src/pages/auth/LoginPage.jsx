import { useState } from 'react';
import { Link as RouterLink, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import AuthLayout from '../../components/auth/AuthLayout';
import { login } from '../../services/authService';
import { isAuthenticated, saveToken } from '../../utils/auth';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('sessionExpired') === 'true';

  const redirectTo = location.state?.from?.pathname || '/dashboard';
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated()) {
    return <Navigate replace to="/dashboard" />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { token } = await login(formValues);
      saveToken(token);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(
        requestError.message ||
          requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          'Unable to sign in. Please check your credentials.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDemoFill(email, password) {
    setFormValues({ email, password });
    setError('');
  }

  return (
    <AuthLayout
      subtitle="Sign in to report, follow, and help resolve local civic issues."
      title="Welcome back"
    >
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {sessionExpired && (
            <Alert severity="warning">Your session expired or your token was invalid. Please sign in again.</Alert>
          )}
          {location.state?.message && <Alert severity="success">{location.state.message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Quick Demo Access Box */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.default',
              border: '1px dashed',
              borderColor: 'primary.main',
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1 }}>
              ⚡ QUICK DEMO LOGIN (FOR REVIEWERS & DEMOS)
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => handleDemoFill('armytech400@gmail.com', '4321')}
                sx={{ textTransform: 'none', fontWeight: 600, flex: 1 }}
              >
                👤 Citizen Demo
              </Button>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => handleDemoFill('admin@urbanfix.com', 'admin123')}
                sx={{ textTransform: 'none', fontWeight: 600, flex: 1 }}
              >
                🛡️ Admin Demo
              </Button>
            </Stack>
          </Paper>

          <TextField
            autoComplete="email"
            autoFocus
            fullWidth
            label="Email address"
            name="email"
            onChange={handleChange}
            required
            type="email"
            value={formValues.email}
          />
          <TextField
            autoComplete="current-password"
            fullWidth
            label="Password"
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={formValues.password}
          />
          <Button
            disabled={isSubmitting}
            fullWidth
            startIcon={<LoginRoundedIcon />}
            type="submit"
            variant="contained"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
          <Typography align="center" color="text.secondary" variant="body2">
            New to UrbanFix?{' '}
            <Link component={RouterLink} to="/register" underline="hover">
              Create an account
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}


export default LoginPage;

