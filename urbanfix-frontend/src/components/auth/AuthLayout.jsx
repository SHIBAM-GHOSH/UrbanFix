import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

function AuthLayout({ children, subtitle, title }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        background: 'linear-gradient(135deg, #F5F3FF 0%, #F8FAFC 48%, #EEF2FF 100%)',
        display: 'flex',
        minHeight: '100vh',
        py: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="sm">
        <Stack alignItems="center" spacing={3}>
          <Stack alignItems="center" direction="row" spacing={1}>
            <AutoAwesomeRoundedIcon color="primary" />
            <Typography color="primary" fontWeight={800} variant="h5">
              UrbanFix
            </Typography>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'rgba(109, 40, 217, 0.12)',
              maxWidth: 480,
              p: { xs: 3, sm: 5 },
              width: '100%',
            }}
          >
            <Stack spacing={1} sx={{ mb: 4 }}>
              <Typography component="h1" variant="h2">
                {title}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {subtitle}
              </Typography>
            </Stack>
            {children}
          </Paper>

          <Typography align="center" color="text.secondary" variant="caption">
            Report civic issues. Help improve your community.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default AuthLayout;
