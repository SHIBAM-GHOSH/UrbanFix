import { Button, CircularProgress } from '@mui/material';

function LoadingButton({
  children,
  disabled = false,
  loading = false,
  loadingText,
  startIcon,
  variant = 'contained',
  ...props
}) {
  return (
    <Button
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress color="inherit" size={18} /> : startIcon}
      variant={variant}
      {...props}
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}

export default LoadingButton;
