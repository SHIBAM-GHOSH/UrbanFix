import { Box, CircularProgress, Stack, Typography } from '@mui/material';

function LoadingState({ message = 'Loading...', minHeight = '50vh' }) {
  return (
    <Box alignItems="center" display="flex" justifyContent="center" minHeight={minHeight}>
      <Stack alignItems="center" spacing={2}>
        <CircularProgress />
        {message && (
          <Typography color="text.secondary" variant="body2">
            {message}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export default LoadingState;
