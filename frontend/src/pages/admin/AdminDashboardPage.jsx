import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import TimelapseRoundedIcon from '@mui/icons-material/TimelapseRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../../components/dashboard/StatCard';
import EmptyState from '../../components/shared/EmptyState';
import ComplaintOverviewMap from '../../components/maps/ComplaintOverviewMap';
import {
  getAdminDashboardStatistics,
  getAdminComplaints,
  getCategoryAnalytics,
} from '../../services/adminService';

const CHART_COLORS = ['#7C3AED', '#2563EB', '#059669', '#D97706', '#DC2626', '#0891B2', '#8B5CF6'];

const STATUS_CONFIG = {
  PENDING: { bg: '#FEF3C7', color: '#D97706', label: 'Pending' },
  IN_PROGRESS: { bg: '#EDE9FE', color: '#7C3AED', label: 'In Progress' },
  RESOLVED: { bg: '#D1FAE5', color: '#059669', label: 'Resolved' },
  REJECTED: { bg: '#F3F4F6', color: '#4B5563', label: 'Rejected' },
};

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAdminData() {
      setLoading(true);
      setError('');

      try {
        const [statsData, categoryData, complaintsPage] = await Promise.all([
          getAdminDashboardStatistics(),
          getCategoryAnalytics(),
          getAdminComplaints({ page: 0, size: 5, sortBy: 'createdAt', sortDirection: 'desc' }),
        ]);

        if (isMounted) {
          setDashboard(statsData);
          setCategories(categoryData || []);
          setRecentComplaints(complaintsPage?.content || []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              requestError.response?.data?.error ||
              'We could not load the admin operations dashboard.',
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, []);

  const total = dashboard?.totalComplaints ?? 0;
  const pending = dashboard?.pendingComplaints ?? 0;
  const inProgress = dashboard?.inProgressComplaints ?? 0;
  const resolved = dashboard?.resolvedComplaints ?? 0;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const statCards = [
    {
      color: '#2563EB',
      icon: <AssignmentRoundedIcon fontSize="medium" />,
      label: 'Total Complaints',
      subtitle: `${total} logged issues`,
      value: total,
    },
    {
      color: '#D97706',
      icon: <PendingActionsRoundedIcon fontSize="medium" />,
      label: 'Pending Action',
      subtitle: `${pending} unassigned issues`,
      value: pending,
    },
    {
      color: '#7C3AED',
      icon: <TimelapseRoundedIcon fontSize="medium" />,
      label: 'In Progress',
      subtitle: `${inProgress} active field repairs`,
      value: inProgress,
    },
    {
      color: '#059669',
      icon: <CheckCircleRoundedIcon fontSize="medium" />,
      label: 'Resolved Issues',
      subtitle: total > 0 ? `${resolutionRate}% overall resolution` : '0% resolved',
      value: resolved,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        {/* Operations Navigation Banner */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2}>
              <Box>
                <Typography color="primary" fontWeight={800} variant="overline" sx={{ letterSpacing: 1 }}>
                  Operations Control Center
                </Typography>
                <Typography component="h1" variant="h2" fontWeight={900}>
                  Admin Operations Dashboard
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                  Monitor civic issue streams, track resolution velocity, and manage municipal teams.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1.5}>
                <Button
                  component={RouterLink}
                  startIcon={<ManageSearchRoundedIcon />}
                  to="/admin/complaints"
                  variant="contained"
                >
                  Manage Complaints
                </Button>
                <Button
                  component={RouterLink}
                  startIcon={<BarChartRoundedIcon />}
                  to="/admin/analytics"
                  variant="outlined"
                >
                  Analytics
                </Button>
              </Stack>
            </Stack>

            {/* Quick Nav Tabs */}
            <Tabs value={0} indicatorColor="primary" textColor="primary" sx={{ borderBottom: 1, borderColor: 'divider', pt: 1 }}>
              <Tab label="Overview" component={RouterLink} to="/admin" sx={{ fontWeight: 800 }} />
              <Tab label="Complaint Queue" component={RouterLink} to="/admin/complaints" sx={{ fontWeight: 700 }} />
              <Tab label="Category Analytics" component={RouterLink} to="/admin/analytics" sx={{ fontWeight: 700 }} />
            </Tabs>
          </Stack>
        </Paper>

        {error && <Alert severity="error">{error}</Alert>}

        {/* KPI Stat Cards */}
        <Grid container spacing={2.5}>
          {statCards.map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
              {loading ? <Skeleton height={140} variant="rounded" sx={{ borderRadius: 3 }} /> : <StatCard {...stat} />}
            </Grid>
          ))}
        </Grid>

        {/* Charts & Recent Stream Grid */}
        <Grid container spacing={3}>
          {/* Category Analytics Chart */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h3" fontWeight={800}>
                Complaints by Category
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                Distribution across municipal service departments.
              </Typography>

              {loading ? (
                <Skeleton height={260} variant="rounded" sx={{ borderRadius: 2 }} />
              ) : categories.length > 0 ? (
                <Box sx={{ width: '100%', height: 280, mt: 'auto' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        dataKey="complaintCount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={3}
                      >
                        {categories.map((entry, index) => (
                          <Cell key={`cell-${entry.category}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => [`${val} complaints`, 'Volume']}
                        contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontWeight: 600 }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <EmptyState description="No category telemetry available yet." title="No Data" />
              )}
            </Paper>
          </Grid>

          {/* Incoming Complaint Stream */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <Stack spacing={2.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h3" fontWeight={800}>
                      Incoming Complaints Queue
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Recent reports requiring status assignment or review.
                    </Typography>
                  </Box>
                  <Button
                    component={RouterLink}
                    endIcon={<ArrowForwardRoundedIcon />}
                    to="/admin/complaints"
                    size="small"
                    sx={{ fontWeight: 700 }}
                  >
                    View Queue
                  </Button>
                </Stack>

                {loading ? (
                  <Stack spacing={1.5}>
                    <Skeleton height={60} variant="rounded" />
                    <Skeleton height={60} variant="rounded" />
                    <Skeleton height={60} variant="rounded" />
                  </Stack>
                ) : recentComplaints.length > 0 ? (
                  <Stack spacing={1.5}>
                    {recentComplaints.map((item) => {
                      const statusCfg = STATUS_CONFIG[item.status] || { bg: '#E2E8F0', color: '#334155', label: item.status };
                      return (
                        <Paper
                          key={item.id}
                          elevation={0}
                          component={RouterLink}
                          to={`/complaints/${item.id}`}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1, pr: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                              <Typography fontWeight={800} variant="body2" noWrap sx={{ maxWidth: 300 }}>
                                {item.title}
                              </Typography>
                              <Chip
                                label={statusCfg.label}
                                size="small"
                                sx={{ bgcolor: statusCfg.bg, color: statusCfg.color, fontWeight: 800, height: 20, fontSize: '0.7rem' }}
                              />
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1.5} color="text.secondary">
                              <Typography variant="caption">{item.category}</Typography>
                              {item.location && (
                                <Stack direction="row" alignItems="center" spacing={0.25}>
                                  <PlaceRoundedIcon sx={{ fontSize: 14 }} color="action" />
                                  <Typography variant="caption" noWrap sx={{ maxWidth: 160 }}>
                                    {item.location}
                                  </Typography>
                                </Stack>
                              )}
                              <Typography variant="caption" color="text.disabled">
                                • {formatDate(item.createdAt)}
                              </Typography>
                            </Stack>
                          </Stack>
                          <ArrowForwardRoundedIcon color="action" fontSize="small" />
                        </Paper>
                      );
                    })}
                  </Stack>
                ) : (
                  <EmptyState description="No active complaints in queue." title="Queue Empty" />
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Triage Actions */}
        <Box>
          <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
            Triage & Filter Shortcuts
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                component={RouterLink}
                to="/admin/complaints?status=PENDING"
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2.5,
                  p: 2.5,
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { borderColor: 'warning.main', transform: 'translateY(-2px)' },
                }}
              >
                <PendingActionsRoundedIcon color="warning" sx={{ fontSize: 36 }} />
                <Box>
                  <Typography fontWeight={800} variant="body1">
                    Pending Queue ({pending})
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    Issues awaiting initial response assignment.
                  </Typography>
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                component={RouterLink}
                to="/admin/complaints?status=IN_PROGRESS"
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2.5,
                  p: 2.5,
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' },
                }}
              >
                <TimelapseRoundedIcon color="primary" sx={{ fontSize: 36 }} />
                <Box>
                  <Typography fontWeight={800} variant="body1">
                    In Progress ({inProgress})
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    Active municipal work orders under repair.
                  </Typography>
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                component={RouterLink}
                to="/admin/complaints?status=RESOLVED"
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2.5,
                  p: 2.5,
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { borderColor: 'success.main', transform: 'translateY(-2px)' },
                }}
              >
                <CheckCircleRoundedIcon color="success" sx={{ fontSize: 36 }} />
                <Box>
                  <Typography fontWeight={800} variant="body1">
                    Resolved Archive ({resolved})
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    Completed civic repairs and verified fixes.
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Municipal Geographic Operations Map */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack spacing={2.5}>
            <Box>
              <Typography fontWeight={800} variant="h3">
                Live Municipal Operations Map
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Geographic visualization of reported civic incidents across the city.
              </Typography>
            </Box>
            <ComplaintOverviewMap complaints={recentComplaints} height={420} />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default AdminDashboardPage;

