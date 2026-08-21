import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import { clearToken } from '../../utils/auth';
import { getCurrentUser } from '../../services/userService';

const userLinks = [
  { icon: <DashboardRoundedIcon />, label: 'Dashboard', to: '/dashboard' },
  { icon: <AssignmentRoundedIcon />, label: 'My Complaints', to: '/complaints' },
  { icon: <AddCircleOutlineRoundedIcon />, label: 'Report Issue', to: '/complaints/new', variant: 'contained' },
];

const adminLinks = [
  { icon: <AdminPanelSettingsRoundedIcon />, label: 'Admin Triage', to: '/admin' },
  { icon: <AssignmentRoundedIcon />, label: 'Manage Queue', to: '/admin/complaints' },
  { icon: <RouteRoundedIcon />, label: 'Route Planner', to: '/admin/routes' },
];

function getInitials(name) {
  if (!name) return 'UF';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function isRouteActive(pathname, target) {
  if (target === '/dashboard' || target === '/admin') {
    return pathname === target;
  }

  return pathname === target || pathname.startsWith(`${target}/`);
}

function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [accountAnchor, setAccountAnchor] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const data = await getCurrentUser();
        if (isMounted) {
          setProfile(data);
        }
      } catch {
        // Expired sessions are handled by the Axios interceptor.
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleLogout() {
    clearToken();
    setAccountAnchor(null);
    setIsDrawerOpen(false);
    navigate('/login', { replace: true });
  }

  function handleNavigate(to) {
    setIsDrawerOpen(false);
    navigate(to);
  }

  function renderDesktopLink(link) {
    const active = isRouteActive(location.pathname, link.to);

    return (
      <Button
        component={NavLink}
        key={link.to}
        startIcon={link.icon}
        to={link.to}
        variant={link.variant || 'text'}
        sx={{
          bgcolor: active && !link.variant ? 'primary.light' : undefined,
          color: active && !link.variant ? 'primary.dark' : undefined,
          display: { xs: 'none', md: 'inline-flex' },
          whiteSpace: 'nowrap',
          fontWeight: 700,
          fontSize: '0.875rem',
          px: 1.5,
          py: 0.75,
          borderRadius: 2,
          '& .MuiButton-startIcon': {
            mr: 0.75,
            '& > *': {
              fontSize: '1.15rem !important',
            },
          },
        }}
      >
        {link.label}
      </Button>
    );
  }

  return (
    <AppBar
      color="inherit"
      elevation={0}
      position="sticky"
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(14px)',
        bgcolor: 'rgba(255, 255, 255, 0.94)',
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 2, justifyContent: 'space-between', minHeight: { xs: 64, md: 72 } }}>
          {/* Logo */}
          <Stack
            alignItems="center"
            color="primary.main"
            component={RouterLink}
            direction="row"
            spacing={1}
            sx={{ textDecoration: 'none' }}
            to="/dashboard"
          >
            <AutoAwesomeRoundedIcon />
            <Typography fontWeight={900} variant="h6" sx={{ letterSpacing: '-0.02em' }}>
              UrbanFix
            </Typography>
          </Stack>

          {/* Desktop Links */}
          <Stack alignItems="center" direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, minWidth: 0 }}>
            {userLinks.map(renderDesktopLink)}

            {profile?.role === 'ADMIN' && (
              <>
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />
                {adminLinks.map(renderDesktopLink)}
              </>
            )}
          </Stack>

          {/* Right Action Icons */}
          <Stack alignItems="center" direction="row" spacing={1}>
            <Tooltip title="Open Navigation Menu">
              <IconButton
                aria-label="Open navigation"
                color="primary"
                onClick={() => setIsDrawerOpen(true)}
                sx={{ display: { xs: 'inline-flex', md: 'none' } }}
              >
                <MenuRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Account Menu">
              <IconButton aria-label="Open account menu" onClick={(event) => setAccountAnchor(event.currentTarget)}>
                <Avatar sx={{ bgcolor: 'primary.main', fontSize: 14, fontWeight: 900, height: 38, width: 38 }}>
                  {getInitials(profile?.fullName)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </Container>

      {/* Account Dropdown Menu */}
      <Menu
        anchorEl={accountAnchor}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        open={Boolean(accountAnchor)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        onClose={() => setAccountAnchor(null)}
        PaperProps={{
          elevation: 4,
          sx: { borderRadius: 3, minWidth: 220, mt: 1 },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography fontWeight={800} noWrap variant="subtitle2">
            {profile?.fullName || 'UrbanFix User'}
          </Typography>
          <Typography color="text.secondary" noWrap variant="caption">
            {profile?.email || 'Signed in'}
          </Typography>
        </Box>
        <Divider />
        <MenuItem component={RouterLink} to="/profile" onClick={() => setAccountAnchor(null)} sx={{ py: 1.2 }}>
          <ListItemIcon><AccountCircleRoundedIcon fontSize="small" /></ListItemIcon>
          Profile Page
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ py: 1.2 }}>
          <ListItemIcon><LogoutRoundedIcon color="error" fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '85vw', sm: 340 }, borderRadius: '16px 0 0 16px' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Drawer Header Banner */}
          <Box sx={{ p: 2.5, bgcolor: 'primary.light' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 900, width: 44, height: 44 }}>
                  {getInitials(profile?.fullName)}
                </Avatar>
                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                  <Typography fontWeight={800} noWrap variant="subtitle2">
                    {profile?.fullName || 'UrbanFix User'}
                  </Typography>
                  <Chip
                    color={profile?.role === 'ADMIN' ? 'secondary' : 'default'}
                    label={profile?.role || 'CITIZEN'}
                    size="small"
                    sx={{ width: 'fit-content', height: 20, fontSize: '0.65rem', fontWeight: 800 }}
                  />
                </Stack>
              </Stack>
              <IconButton onClick={() => setIsDrawerOpen(false)} size="small">
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          </Box>

          <Divider />

          {/* Drawer Links */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5 }}>
            <Typography color="text.secondary" fontWeight={800} variant="caption" sx={{ px: 2, pt: 1, pb: 0.5, display: 'block' }}>
              CITIZEN WORKSPACE
            </Typography>
            <List disablePadding>
              {userLinks.map((link) => {
                const active = isRouteActive(location.pathname, link.to);
                return (
                  <ListItemButton
                    key={link.to}
                    selected={active}
                    onClick={() => handleNavigate(link.to)}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ color: active ? 'primary.main' : 'text.secondary', minWidth: 38 }}>
                      {link.icon}
                    </ListItemIcon>
                    <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: active ? 800 : 600, fontSize: '0.9rem' }} />
                  </ListItemButton>
                );
              })}
            </List>

            {profile?.role === 'ADMIN' && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography color="text.secondary" fontWeight={800} variant="caption" sx={{ px: 2, pb: 0.5, display: 'block' }}>
                  ADMIN TRIAGE
                </Typography>
                <List disablePadding>
                  {adminLinks.map((link) => {
                    const active = isRouteActive(location.pathname, link.to);
                    return (
                      <ListItemButton
                        key={link.to}
                        selected={active}
                        onClick={() => handleNavigate(link.to)}
                        sx={{ borderRadius: 2, mb: 0.5 }}
                      >
                        <ListItemIcon sx={{ color: active ? 'primary.main' : 'text.secondary', minWidth: 38 }}>
                          {link.icon}
                        </ListItemIcon>
                        <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: active ? 800 : 600, fontSize: '0.9rem' }} />
                      </ListItemButton>
                    );
                  })}
                </List>
              </>
            )}
          </Box>

          <Divider />

          {/* Drawer Footer Actions */}
          <Box sx={{ p: 2 }}>
            <Stack spacing={1}>
              <ListItemButton onClick={() => handleNavigate('/profile')} sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ minWidth: 38 }}><AccountCircleRoundedIcon /></ListItemIcon>
                <ListItemText primary="View Profile" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
              </ListItemButton>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
                <ListItemIcon sx={{ minWidth: 38, color: 'error.main' }}><LogoutRoundedIcon /></ListItemIcon>
                <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 800, fontSize: '0.9rem' }} />
              </ListItemButton>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default AppHeader;

