import { Alert } from '@mui/material';

function ErrorAlert({ message, sx }) {
  if (!message) return null;

  return (
    <Alert severity="error" sx={sx}>
      {message}
    </Alert>
  );
}

export default ErrorAlert;
