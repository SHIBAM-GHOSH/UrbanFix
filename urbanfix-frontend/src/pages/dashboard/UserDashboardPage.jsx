import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import StatCard from '../../components/dashboard/StatCard';
import { getCurrentUser, getUserDashboardStatistics } from '../../services/userService';

function UserDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [userData, statisticsData] = await Promise.all([
          getCurrentUser(),
          getUserDashboardStatistics(),
        ]);
        setProfile(userData);
        setStatistics(statisticsData);
      } catch (requestError) {
        setError(requestError.response?.data?.error || 'We could not load your dashboard.');
      }
    }

    loadDashboard();
  }, []);

  const statCards = [
    {
      color: '#2563EB',
      icon: <AssignmentRoundedIcon />,
      label: 'Total complaints',
      value: statistics?.totalComplaints ?? 0,
    },
    {
      color: '#D97706',
      icon: <PendingActionsRoundedIcon />,
      label: 'Awaiting action',
      value: statistics?.pendingComplaints ?? 0,
    },
    {
      color: '#16A34A',
      icon: <CheckCircleRoundedIcon />,
      label: 'Resolved',
      value: statistics?.resolvedComplaints ?? 0,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <Box>
          <Typography color="primary" fontWeight={800} variant="overline">
            Citizen dashboard
          </Typography>
          {profile ? (
            <Typography component="h1" variant="h1">
              Hello, {profile.fullName.split(' ')[0]}.
            </Typography>
          ) : (
            <Skeleton sx={{ maxWidth: 260 }} variant="text" />
          )}
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Keep track of the civic issues you have reported in your community.
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2.5}>
          {statCards.map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, md: 4 }}>
              {statistics ? <StatCard {...stat} /> : <Skeleton height={130} variant="rounded" />}
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Stack alignItems={{ md: 'center' }} direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3}>
            <Box>
              <Typography gutterBottom variant="h3">
                See an issue around you?
              </Typography>
              <Typography color="text.secondary">
                Submit a clear report with the location and a photo to help local teams respond.
              </Typography>
            </Box>
            <Button component={RouterLink} startIcon={<AddCircleOutlineRoundedIcon />} to="/complaints/new" variant="contained">
              Report an issue
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default UserDashboardPage;
