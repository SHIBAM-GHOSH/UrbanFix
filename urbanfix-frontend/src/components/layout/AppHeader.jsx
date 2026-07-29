import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { clearToken } from '../../utils/auth';

function AppHeader() {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate('/login', { replace: true });
  }

  return (
    <AppBar color="inherit" elevation={0} position="sticky" sx={{ borderBottom: '1px solid #E8EDF4' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 72 } }}>
          <Stack alignItems="center" color="primary.main" component={RouterLink} direction="row" spacing={1} sx={{ textDecoration: 'none' }} to="/dashboard">
            <AutoAwesomeRoundedIcon />
            <Typography fontWeight={800} variant="h6">
              UrbanFix
            </Typography>
          </Stack>

          <Stack alignItems="center" direction="row" spacing={{ xs: 0.5, sm: 1 }}>
            <Button component={RouterLink} startIcon={<DashboardRoundedIcon />} to="/dashboard">
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Dashboard
              </Box>
            </Button>
            <Button component={RouterLink} startIcon={<AssignmentRoundedIcon />} to="/complaints">
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                My complaints
              </Box>
            </Button>
            <Button component={RouterLink} startIcon={<AddCircleOutlineRoundedIcon />} to="/complaints/new" variant="contained">
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Report issue
              </Box>
            </Button>
            <Tooltip title="Sign out">
              <IconButton aria-label="Sign out" color="primary" onClick={handleLogout}>
                <LogoutRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppHeader;
