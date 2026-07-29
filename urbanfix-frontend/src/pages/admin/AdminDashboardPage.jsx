import { useEffect, useState } from 'react';
import { Alert, Box, Container, Grid, Paper, Skeleton, Stack, Typography } from '@mui/material';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import TimelapseRoundedIcon from '@mui/icons-material/TimelapseRounded';
import CategoryAnalyticsChart from '../../components/analytics/CategoryAnalyticsChart';
import MonthlyAnalyticsChart from '../../components/analytics/MonthlyAnalyticsChart';
import StatCard from '../../components/dashboard/StatCard';
import { getAdminDashboardStatistics, getCategoryAnalytics, getMonthlyAnalytics } from '../../services/adminService';

function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashboardData, categoryData, monthlyData] = await Promise.all([
          getAdminDashboardStatistics(),
          getCategoryAnalytics(),
          getMonthlyAnalytics(),
        ]);
        setDashboard(dashboardData);
        setCategories(categoryData);
        setMonthly(monthlyData);
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
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography gutterBottom variant="h3">Monthly complaints</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">Incoming reports grouped by month.</Typography>
              {dashboard ? <MonthlyAnalyticsChart data={monthly} /> : <Skeleton height={300} variant="rounded" />}
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography gutterBottom variant="h3">Categories</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">Distribution of reported civic issues.</Typography>
              {dashboard ? <CategoryAnalyticsChart data={categories} /> : <Skeleton height={300} variant="rounded" />}
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}

export default AdminDashboardPage;
