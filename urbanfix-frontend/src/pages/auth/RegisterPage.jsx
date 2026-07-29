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
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import AuthLayout from '../../components/auth/AuthLayout';
import { register } from '../../services/authService';

function RegisterPage() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ fullName: '', email: '', password: '' });
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
      await register(formValues);
      navigate('/login', {
        replace: true,
        state: { message: 'Account created successfully. Please sign in.' },
      });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      subtitle="Join your neighbors in making local services better."
      title="Create your account"
    >
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            autoComplete="name"
            autoFocus
            fullWidth
            label="Full name"
            name="fullName"
            onChange={handleChange}
            required
            value={formValues.fullName}
          />
          <TextField
            autoComplete="email"
            fullWidth
            label="Email address"
            name="email"
            onChange={handleChange}
            required
            type="email"
            value={formValues.email}
          />
          <TextField
            autoComplete="new-password"
            fullWidth
            helperText="Use a password you can remember securely."
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
            startIcon={<PersonAddAltRoundedIcon />}
            type="submit"
            variant="contained"
          >
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
          <Typography align="center" color="text.secondary" variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}

export default RegisterPage;
