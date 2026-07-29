import { useEffect, useState } from 'react';
import { Alert, Box, Container, Grid, Paper, Skeleton, Stack, Typography } from '@mui/material';
import CategoryAnalyticsChart from '../../components/analytics/CategoryAnalyticsChart';
import MonthlyAnalyticsChart from '../../components/analytics/MonthlyAnalyticsChart';
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
          setCategories(categoryData);
          setMonthly(monthlyData);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.response?.data?.message || requestError.response?.data?.error || 'Unable to load analytics.');
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

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)', py: { xs: 4, md: 5 } }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box>
            <Typography color="primary" fontWeight={800} variant="overline">
              Admin insights
            </Typography>
            <Typography component="h1" fontWeight={900} variant="h4">
              Analytics
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Track complaint categories and monthly reporting patterns.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2.5}>
            <Grid item lg={7} xs={12}>
              <Paper sx={{ border: '1px solid #E8EDF4', borderRadius: 2, p: { xs: 2.5, md: 3 } }}>
                <Typography gutterBottom variant="h3">
                  Monthly complaints
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
                  Incoming reports grouped by month.
                </Typography>
                {isLoading ? <Skeleton height={300} variant="rounded" /> : <MonthlyAnalyticsChart data={monthly} />}
              </Paper>
            </Grid>
            <Grid item lg={5} xs={12}>
              <Paper sx={{ border: '1px solid #E8EDF4', borderRadius: 2, p: { xs: 2.5, md: 3 } }}>
                <Typography gutterBottom variant="h3">
                  Category distribution
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
                  Complaint volume by civic issue type.
                </Typography>
                {isLoading ? <Skeleton height={300} variant="rounded" /> : <CategoryAnalyticsChart data={categories} />}
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

export default AdminAnalyticsPage;
