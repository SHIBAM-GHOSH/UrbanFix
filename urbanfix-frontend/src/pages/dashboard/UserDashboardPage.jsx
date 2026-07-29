import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { clearToken } from '../../utils/auth';

function UserDashboardPage() {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate('/login', { replace: true });
  }

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 8 } }}>
      <Container maxWidth="md">
        <Paper sx={{ overflow: 'hidden', p: { xs: 3, sm: 5 } }}>
          <Stack alignItems="flex-start" spacing={3}>
            <Typography color="primary" fontWeight={800} variant="overline">
              UrbanFix citizen portal
            </Typography>
            <Box>
              <Typography component="h1" gutterBottom variant="h1">
                You’re signed in.
              </Typography>
              <Typography color="text.secondary" maxWidth={580}>
                Your complaint dashboard is ready to be built next. You can safely sign out
                or continue to the complaint workflow once it is added.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button disabled startIcon={<AddCircleOutlineRoundedIcon />} variant="contained">
                Report an issue soon
              </Button>
              <Button color="inherit" onClick={handleLogout} startIcon={<LogoutRoundedIcon />}>
                Sign out
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default UserDashboardPage;
