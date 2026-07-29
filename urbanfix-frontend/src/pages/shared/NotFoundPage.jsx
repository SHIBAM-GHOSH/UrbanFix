import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded';

function NotFoundPage() {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SentimentDissatisfiedRoundedIcon sx={{ fontSize: 48 }} />
            </Box>

            <Typography fontWeight={900} variant="h1" color="primary" sx={{ fontSize: '3.5rem', lineHeight: 1 }}>
              404
            </Typography>

            <Box>
              <Typography fontWeight={800} variant="h3" gutterBottom>
                Page Not Found
              </Typography>
              <Typography color="text.secondary" variant="body1">
                The civic portal page you are looking for does not exist, has been moved, or is temporarily unavailable.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', pt: 1 }}>
              <Button
                component={RouterLink}
                fullWidth
                size="large"
                startIcon={<ArrowBackRoundedIcon />}
                to={-1}
                variant="outlined"
              >
                Go Back
              </Button>
              <Button
                component={RouterLink}
                fullWidth
                size="large"
                startIcon={<HomeRoundedIcon />}
                to="/dashboard"
                variant="contained"
              >
                Dashboard
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default NotFoundPage;
