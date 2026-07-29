import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
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
import { clearToken } from '../../utils/auth';
import { getCurrentUser } from '../../services/userService';

const userLinks = [
  { icon: <DashboardRoundedIcon />, label: 'Dashboard', to: '/dashboard' },
  { icon: <AssignmentRoundedIcon />, label: 'My complaints', to: '/complaints' },
  { icon: <AddCircleOutlineRoundedIcon />, label: 'Report issue', to: '/complaints/new', variant: 'contained' },
];

const adminLinks = [
  { icon: <AdminPanelSettingsRoundedIcon />, label: 'Admin', to: '/admin' },
  { icon: <AssignmentRoundedIcon />, label: 'Manage', to: '/admin/complaints' },
  { icon: <BarChartRoundedIcon />, label: 'Analytics', to: '/admin/analytics' },
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

  const visibleLinks = useMemo(() => (
    profile?.role === 'ADMIN' ? [...userLinks, ...adminLinks] : userLinks
  ), [profile]);

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
        bgcolor: 'rgba(255, 255, 255, 0.92)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 2, justifyContent: 'space-between', minHeight: { xs: 64, md: 72 } }}>
          <Stack alignItems="center" color="primary.main" component={RouterLink} direction="row" spacing={1} sx={{ textDecoration: 'none' }} to="/dashboard">
            <AutoAwesomeRoundedIcon />
            <Typography fontWeight={900} variant="h6">
              UrbanFix
            </Typography>
          </Stack>

          <Stack alignItems="center" direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, minWidth: 0 }}>
            {userLinks.map(renderDesktopLink)}

            {profile?.role === 'ADMIN' && (
              <>
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />
                {adminLinks.map(renderDesktopLink)}
              </>
            )}
          </Stack>

          <Stack alignItems="center" direction="row" spacing={0.5}>
            <Tooltip title="Menu">
              <IconButton
                aria-label="Open navigation"
                color="primary"
                onClick={() => setIsDrawerOpen(true)}
                sx={{ display: { xs: 'inline-flex', md: 'none' } }}
              >
                <MenuRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton aria-label="Open account menu" onClick={(event) => setAccountAnchor(event.currentTarget)}>
                <Avatar sx={{ bgcolor: 'primary.main', fontSize: 14, fontWeight: 900, height: 36, width: 36 }}>
                  {getInitials(profile?.fullName)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </Container>

      <Menu
        anchorEl={accountAnchor}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        open={Boolean(accountAnchor)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        onClose={() => setAccountAnchor(null)}
      >
        <Box sx={{ maxWidth: 260, px: 2, py: 1 }}>
          <Typography fontWeight={900} noWrap>{profile?.fullName || 'UrbanFix user'}</Typography>
          <Typography color="text.secondary" noWrap variant="body2">{profile?.email || 'Signed in'}</Typography>
        </Box>
        <Divider />
        <MenuItem component={RouterLink} to="/profile" onClick={() => setAccountAnchor(null)}>
          <ListItemIcon><AccountCircleRoundedIcon fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutRoundedIcon color="error" fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box sx={{ width: 300 }}>
          <Stack spacing={0.5} sx={{ p: 2.5 }}>
            <Stack alignItems="center" direction="row" spacing={1}>
              <AutoAwesomeRoundedIcon color="primary" />
              <Typography color="primary" fontWeight={900} variant="h6">
                UrbanFix
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="body2">
              {profile?.role === 'ADMIN' ? 'Admin workspace' : 'Citizen workspace'}
            </Typography>
          </Stack>
          <Divider />
          <List sx={{ px: 1.5 }}>
            {userLinks.map((link) => {
              const active = isRouteActive(location.pathname, link.to);
              return (
                <ListItemButton key={link.to} selected={active} onClick={() => handleNavigate(link.to)}>
                  <ListItemIcon sx={{ color: active ? 'primary.main' : 'text.secondary' }}>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              );
            })}
          </List>
          {profile?.role === 'ADMIN' && (
            <>
              <Divider />
              <Typography color="text.secondary" fontWeight={900} sx={{ px: 2.5, pt: 2 }} variant="caption">
                ADMIN
              </Typography>
              <List sx={{ px: 1.5 }}>
                {adminLinks.map((link) => {
                  const active = isRouteActive(location.pathname, link.to);
                  return (
                    <ListItemButton key={link.to} selected={active} onClick={() => handleNavigate(link.to)}>
                      <ListItemIcon sx={{ color: active ? 'primary.main' : 'text.secondary' }}>{link.icon}</ListItemIcon>
                      <ListItemText primary={link.label} />
                    </ListItemButton>
                  );
                })}
              </List>
            </>
          )}
          <Divider />
          <List sx={{ px: 1.5 }}>
            <ListItemButton onClick={() => handleNavigate('/profile')}>
              <ListItemIcon><AccountCircleRoundedIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><LogoutRoundedIcon color="error" /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default AppHeader;
