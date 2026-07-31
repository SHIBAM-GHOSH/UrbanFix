import { Avatar, Box, CircularProgress, Stack, Typography } from '@mui/material';

function LoadingState({ message = 'Loading UrbanFix...', minHeight = '60vh' }) {
  return (
    <Box alignItems="center" display="flex" justifyContent="center" minHeight={minHeight}>
      <Stack alignItems="center" spacing={2.5}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            size={68}
            thickness={4}
            sx={{
              color: 'primary.main',
            }}
          />
          <Avatar
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'primary.main',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '0.875rem',
              width: 38,
              height: 38,
            }}
          >
            UF
          </Avatar>
        </Box>

        {message && (
          <Typography color="text.secondary" fontWeight={700} variant="body2">
            {message}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export default LoadingState;

