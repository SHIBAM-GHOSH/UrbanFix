import { Alert, AlertTitle, Button } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

function ErrorAlert({
  message,
  onRetry,
  retryLabel = 'Try Again',
  sx,
  title,
}) {
  if (!message) return null;

  return (
    <Alert
      action={
        onRetry && (
          <Button
            color="inherit"
            onClick={onRetry}
            size="small"
            startIcon={<RefreshRoundedIcon />}
            sx={{ fontWeight: 800 }}
          >
            {retryLabel}
          </Button>
        )
      }
      severity="error"
      sx={{ borderRadius: 2.5, ...sx }}
    >
      {title && <AlertTitle sx={{ fontWeight: 800 }}>{title}</AlertTitle>}
      {message}
    </Alert>
  );
}

export default ErrorAlert;

