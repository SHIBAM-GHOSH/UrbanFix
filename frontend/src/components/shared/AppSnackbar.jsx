import { Alert, Slide, Snackbar } from '@mui/material';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

function AppSnackbar({ message, onClose, open, severity = 'success' }) {
  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      autoHideDuration={4000}
      onClose={onClose}
      open={open}
      TransitionComponent={SlideTransition}
      sx={{ zIndex: (theme) => theme.zIndex.snackbar + 100 }}
    >
      <Alert
        elevation={6}
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          borderRadius: 2.5,
          fontWeight: 700,
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.18)',
          minWidth: 280,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AppSnackbar;

