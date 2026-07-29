import { useEffect, useState } from 'react';
import { Alert, Box, Button, Container, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import TimelapseRoundedIcon from '@mui/icons-material/TimelapseRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import StatCard from '../../components/dashboard/StatCard';
import { getAdminDashboardStatistics } from '../../services/adminService';

function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashboardData = await getAdminDashboardStatistics();
        setDashboard(dashboardData);
      } catch (requestError) {
        setError(requestError.response?.data?.error || 'We could not load the admin dashboard.');
      }
    }

    loadDashboard();
  }, []);

  const statCards = [
    { color: '#2563EB', icon: <AssignmentRoundedIcon />, label: 'Total complaints', value: dashboard?.totalComplaints ?? 0 },
    { color: '#D97706', icon: <PendingActionsRoundedIcon />, label: 'Pending', value: dashboard?.pendingComplaints ?? 0 },
    { color: '#6D28D9', icon: <TimelapseRoundedIcon />, label: 'In progress', value: dashboard?.inProgressComplaints ?? 0 },
    { color: '#16A34A', icon: <CheckCircleRoundedIcon />, label: 'Resolved', value: dashboard?.resolvedComplaints ?? 0 },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3.5}>
        <Box>
          <Typography color="primary" fontWeight={800} variant="overline">Operations overview</Typography>
          <Typography component="h1" variant="h1">Admin dashboard</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Monitor complaint volume, resolution progress, and reporting patterns.</Typography>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2.5}>
          {statCards.map((stat) => <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>{dashboard ? <StatCard {...stat} /> : <Skeleton height={130} variant="rounded" />}</Grid>)}
        </Grid>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button component={RouterLink} startIcon={<ManageSearchRoundedIcon />} to="/admin/complaints" variant="contained">
            Manage complaints
          </Button>
          <Button component={RouterLink} startIcon={<BarChartRoundedIcon />} to="/admin/analytics" variant="outlined">
            View analytics
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}

export default AdminDashboardPage;
