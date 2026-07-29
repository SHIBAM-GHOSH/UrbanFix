import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded';
import CategoryAnalyticsChart from '../../components/analytics/CategoryAnalyticsChart';
import MonthlyAnalyticsChart from '../../components/analytics/MonthlyAnalyticsChart';
import PageHeader from '../../components/shared/PageHeader';
import { getCategoryAnalytics, getMonthlyAnalytics } from '../../services/adminService';

function AdminAnalyticsPage() {
  const [categories, setCategories] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      setIsLoading(true);
      setError('');

      try {
        const [categoryData, monthlyData] = await Promise.all([
          getCategoryAnalytics(),
          getMonthlyAnalytics(),
        ]);

        if (isMounted) {
          setCategories(categoryData || []);
          setMonthly(monthlyData || []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              requestError.response?.data?.error ||
              'Unable to load analytics telemetry. Please try refreshing.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalCategoryVolume = useMemo(() => {
    return categories.reduce((sum, item) => sum + (item.complaintCount || 0), 0);
  }, [categories]);

  const topCategory = useMemo(() => {
    if (!categories.length) return null;
    return [...categories].sort((a, b) => (b.complaintCount || 0) - (a.complaintCount || 0))[0];
  }, [categories]);

  const peakMonth = useMemo(() => {
    if (!monthly.length) return null;
    const sorted = [...monthly].sort((a, b) => (b.complaintCount || 0) - (a.complaintCount || 0));
    const top = sorted[0];
    if (!top) return null;
    const dateStr = new Date(top.year, top.month - 1).toLocaleString(undefined, {
      month: 'short',
      year: 'numeric',
    });
    return { dateStr, count: top.complaintCount };
  }, [monthly]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <PageHeader
            eyebrow="Admin Insights"
            subtitle="Track complaint categories, department reporting distribution, and monthly trends."
            title="Analytics Telemetry"
          />

          {error && <Alert severity="error">{error}</Alert>}

          {/* Telemetry Insight Summary Cards */}
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  p: 2.5,
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1} color="primary.main">
                    <EqualizerRoundedIcon />
                    <Typography color="text.secondary" fontWeight={800} variant="caption">
                      TOTAL TELEMETRY VOLUME
                    </Typography>
                  </Stack>
                  {isLoading ? (
                    <Skeleton height={40} width={100} />
                  ) : (
                    <Typography fontWeight={900} variant="h3">
                      {totalCategoryVolume.toLocaleString()}
                    </Typography>
                  )}
                  <Typography color="text.secondary" variant="caption">
                    Logged complaint events
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  p: 2.5,
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1} color="secondary.main">
                    <CategoryRoundedIcon />
                    <Typography color="text.secondary" fontWeight={800} variant="caption">
                      TOP REPORTING CATEGORY
                    </Typography>
                  </Stack>
                  {isLoading ? (
                    <Skeleton height={40} width={140} />
                  ) : (
                    <Typography fontWeight={900} variant="h4" noWrap color="primary.main">
                      {topCategory ? topCategory.category : 'N/A'}
                    </Typography>
                  )}
                  <Typography color="text.secondary" variant="caption">
                    {topCategory ? `${topCategory.complaintCount} issues logged` : 'No category data'}
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  p: 2.5,
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1} color="warning.main">
                    <CalendarMonthRoundedIcon />
                    <Typography color="text.secondary" fontWeight={800} variant="caption">
                      PEAK REPORTING MONTH
                    </Typography>
                  </Stack>
                  {isLoading ? (
                    <Skeleton height={40} width={120} />
                  ) : (
                    <Typography fontWeight={900} variant="h4">
                      {peakMonth ? peakMonth.dateStr : 'N/A'}
                    </Typography>
                  )}
                  <Typography color="text.secondary" variant="caption">
                    {peakMonth ? `${peakMonth.count} reports in peak month` : 'No monthly data'}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Grid */}
          <Grid container spacing={3}>
            {/* Monthly Trend Chart */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  p: { xs: 2.5, md: 4 },
                }}
              >
                <Stack spacing={1} sx={{ mb: 3 }}>
                  <Typography variant="h3" fontWeight={800}>
                    Monthly Complaint Trends
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Historical volume of incoming civic complaints over time.
                  </Typography>
                </Stack>

                {isLoading ? (
                  <Skeleton height={320} variant="rounded" sx={{ borderRadius: 2 }} />
                ) : (
                  <MonthlyAnalyticsChart data={monthly} />
                )}
              </Paper>
            </Grid>

            {/* Category Breakdown Donut Chart */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  p: { xs: 2.5, md: 4 },
                }}
              >
                <Stack spacing={1} sx={{ mb: 3 }}>
                  <Typography variant="h3" fontWeight={800}>
                    Category Breakdown
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Relative proportion of complaints across civic departments.
                  </Typography>
                </Stack>

                {isLoading ? (
                  <Skeleton height={320} variant="rounded" sx={{ borderRadius: 2 }} />
                ) : (
                  <CategoryAnalyticsChart data={categories} />
                )}
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

export default AdminAnalyticsPage;

