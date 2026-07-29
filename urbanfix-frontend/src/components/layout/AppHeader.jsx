import { useEffect, useState } from 'react';
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
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import { clearToken } from '../../utils/auth';
import { getCurrentUser } from '../../services/userService';

function AppHeader() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const data = await getCurrentUser();
        if (isMounted) {
          setProfile(data);
        }
      } catch {
        // The global Axios 401 handler owns expired-session redirects.
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

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
            {profile?.role === 'ADMIN' && (
              <>
                <Button component={RouterLink} startIcon={<AdminPanelSettingsRoundedIcon />} to="/admin">
                  <Box component="span" sx={{ display: { xs: 'none', lg: 'inline' } }}>
                    Admin
                  </Box>
                </Button>
                <Button component={RouterLink} startIcon={<AssignmentRoundedIcon />} to="/admin/complaints">
                  <Box component="span" sx={{ display: { xs: 'none', lg: 'inline' } }}>
                    Manage
                  </Box>
                </Button>
                <Button component={RouterLink} startIcon={<BarChartRoundedIcon />} to="/admin/analytics">
                  <Box component="span" sx={{ display: { xs: 'none', lg: 'inline' } }}>
                    Analytics
                  </Box>
                </Button>
              </>
            )}
            <Button component={RouterLink} startIcon={<AccountCircleRoundedIcon />} to="/profile">
              <Box component="span" sx={{ display: { xs: 'none', lg: 'inline' } }}>
                Profile
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
