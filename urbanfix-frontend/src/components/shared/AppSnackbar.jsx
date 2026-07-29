import { Alert, Snackbar } from '@mui/material';

function AppSnackbar({ message, onClose, open, severity = 'success' }) {
  return (
    <Snackbar autoHideDuration={3200} open={open} onClose={onClose}>
      <Alert severity={severity} variant="filled" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AppSnackbar;
