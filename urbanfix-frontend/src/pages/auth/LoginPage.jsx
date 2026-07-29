import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import AuthLayout from '../../components/auth/AuthLayout';
import { login } from '../../services/authService';
import { saveToken } from '../../utils/auth';

function LoginPage() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      subtitle="Sign in to report, follow, and help resolve local civic issues."
      title="Welcome back"
    >
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
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
