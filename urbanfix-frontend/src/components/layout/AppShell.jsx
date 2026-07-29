import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';

function AppShell() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppHeader />
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppShell;
