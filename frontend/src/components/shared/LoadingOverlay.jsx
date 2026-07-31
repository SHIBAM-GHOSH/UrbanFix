import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material';

function LoadingOverlay({ message = 'Processing request...', open = false }) {
  return (
    <Backdrop
      open={open}
      sx={{
        backdropFilter: 'blur(4px)',
        bgcolor: 'rgba(15, 23, 42, 0.4)',
        color: '#FFFFFF',
        zIndex: (theme) => theme.zIndex.drawer + 200,
      }}
    >
      <Stack alignItems="center" spacing={2.5}>
        <CircularProgress color="inherit" size={54} thickness={4} />
        {message && (
          <Typography fontWeight={800} variant="body1">
            {message}
          </Typography>
        )}
      </Stack>
    </Backdrop>
  );
}

export default LoadingOverlay;
