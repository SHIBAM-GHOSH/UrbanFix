import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
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
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import StatCard from '../../components/dashboard/StatCard';
import RecentComplaintItem from '../../components/dashboard/RecentComplaintItem';
import EmptyState from '../../components/shared/EmptyState';
import { getMyComplaints } from '../../services/complaintService';
import { getCurrentUser, getUserDashboardStatistics } from '../../services/userService';

function UserDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError('');

      try {
        const [userData, statisticsData, complaintsPage] = await Promise.all([
          getCurrentUser(),
          getUserDashboardStatistics(),
          getMyComplaints({ page: 0, size: 5, sortBy: 'createdAt', direction: 'desc' }),
        ]);

        if (isMounted) {
          setProfile(userData);
          setStatistics(statisticsData);
          setRecentComplaints(complaintsPage?.content || []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              requestError.response?.data?.error ||
              'We could not load your dashboard. Please try refreshing.',
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const total = statistics?.totalComplaints ?? 0;
  const pending = statistics?.pendingComplaints ?? 0;
  const resolved = statistics?.resolvedComplaints ?? 0;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const statCards = [
    {
      color: '#2563EB',
      icon: <AssignmentRoundedIcon fontSize="medium" />,
      label: 'Total Reported',
      subtitle: `${total} total civic issues`,
      value: total,
    },
    {
      color: '#D97706',
      icon: <PendingActionsRoundedIcon fontSize="medium" />,
      label: 'Pending Resolution',
      subtitle: `${pending} awaiting municipal action`,
      value: pending,
    },
    {
      color: '#059669',
      icon: <CheckCircleRoundedIcon fontSize="medium" />,
      label: 'Resolved Issues',
      subtitle: total > 0 ? `${resolutionRate}% resolution rate` : '0% resolved',
      value: resolved,
    },
  ];

  const quickActions = [
    {
      title: 'Report New Issue',
      description: 'Submit civic problem with location & photo evidence.',
      icon: <AddCircleOutlineRoundedIcon color="primary" sx={{ fontSize: 32 }} />,
      to: '/complaints/new',
      buttonText: 'Report Issue',
      variant: 'contained',
    },
    {
      title: 'My Complaints',
      description: 'Review status updates and track reported complaints.',
      icon: <FormatListBulletedRoundedIcon color="primary" sx={{ fontSize: 32 }} />,
      to: '/complaints',
      buttonText: 'View All',
      variant: 'outlined',
    },
    {
      title: 'My Profile',
      description: 'Manage account settings and user profile details.',
      icon: <PersonOutlineRoundedIcon color="primary" sx={{ fontSize: 32 }} />,
      to: '/profile',
      buttonText: 'Edit Profile',
      variant: 'outlined',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        {/* Header Greeting Banner */}
        <Box>
          <Typography color="primary" fontWeight={800} variant="overline" sx={{ letterSpacing: 1 }}>
            Citizen Portal
          </Typography>
          {loading ? (
            <Skeleton height={50} width={300} variant="text" />
          ) : (
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 0.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  fontWeight: 900,
                  width: 44,
                  height: 44,
                }}
              >
                {profile?.fullName?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography component="h1" variant="h2" fontWeight={900}>
                  Welcome back, {profile?.fullName?.split(' ')[0] || 'Citizen'}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Track and manage civic issues in your neighborhood.
                </Typography>
              </Box>
            </Stack>
          )}
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {/* Statistics Cards */}
        <Grid container spacing={2.5}>
          {statCards.map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, md: 4 }}>
              {loading ? <Skeleton height={140} variant="rounded" sx={{ borderRadius: 3 }} /> : <StatCard {...stat} />}
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions Bar */}
        <Box>
          <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2.5}>
            {quickActions.map((action) => (
              <Grid key={action.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 8px 24px rgba(124, 58, 237, 0.08)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Stack spacing={2} sx={{ flex: 1 }}>
                      <Box>{action.icon}</Box>
                      <Box>
                        <Typography fontWeight={800} variant="h3" sx={{ fontSize: '1.125rem' }}>
                          {action.title}
                        </Typography>
                        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                          {action.description}
                        </Typography>
                      </Box>
                    </Stack>
                    <Box sx={{ pt: 2 }}>
                      <Button
                        component={RouterLink}
                        fullWidth
                        size="medium"
                        startIcon={<ArrowForwardRoundedIcon />}
                        to={action.to}
                        variant={action.variant}
                        sx={{ borderRadius: 2 }}
                      >
                        {action.buttonText}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent Complaints Stream / Activity */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack spacing={3}>
            <Stack alignItems="center" direction="row" justifyContent="space-between">
              <Box>
                <Typography fontWeight={800} variant="h3">
                  Recent Complaints
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Your latest reported civic issues and status tracking.
                </Typography>
              </Box>
              {recentComplaints.length > 0 && (
                <Button
                  component={RouterLink}
                  endIcon={<ArrowForwardRoundedIcon />}
                  to="/complaints"
                  variant="text"
                  sx={{ fontWeight: 700 }}
                >
                  View All ({total})
                </Button>
              )}
            </Stack>

            {loading ? (
              <Stack spacing={2}>
                <Skeleton height={70} variant="rounded" sx={{ borderRadius: 2.5 }} />
                <Skeleton height={70} variant="rounded" sx={{ borderRadius: 2.5 }} />
                <Skeleton height={70} variant="rounded" sx={{ borderRadius: 2.5 }} />
              </Stack>
            ) : recentComplaints.length > 0 ? (
              <Stack spacing={2}>
                {recentComplaints.map((complaint) => (
                  <RecentComplaintItem key={complaint.id} complaint={complaint} />
                ))}
              </Stack>
            ) : (
              <EmptyState
                actionLabel="Report Your First Issue"
                actionTo="/complaints/new"
                description="You haven't reported any civic complaints yet. Help improve your neighborhood by posting an issue."
                title="No Complaints Reported Yet"
              />
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default UserDashboardPage;

