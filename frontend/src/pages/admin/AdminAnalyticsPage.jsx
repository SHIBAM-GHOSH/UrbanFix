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
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded';
import CategoryAnalyticsChart from '../../components/analytics/CategoryAnalyticsChart';
import PageHeader from '../../components/shared/PageHeader';
import { getCategoryAnalytics } from '../../services/adminService';

function AdminAnalyticsPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      setIsLoading(true);
      setError('');

      try {
        const categoryData = await getCategoryAnalytics();
        if (isMounted) {
          setCategories(categoryData || []);
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

  const totalComplaintsInCategories = useMemo(() => {
    return categories.reduce((sum, item) => sum + (item.count || 0), 0);
  }, [categories]);

  const topCategory = useMemo(() => {
    if (!categories || categories.length === 0) return 'N/A';
    const sorted = [...categories].sort((a, b) => (b.count || 0) - (a.count || 0));
    return sorted[0]?.category || 'N/A';
  }, [categories]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        <Stack spacing={3.5}>
          <PageHeader
            eyebrow="Municipal Operations & Insights"
            subtitle="Analyze civic issue distributions across categories to optimize response teams."
            title="Analytics Telemetry"
          />

          {error && <Alert severity="error">{error}</Alert>}

          {/* Metric Summary Cards */}
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        bgcolor: 'primary.50',
                        color: 'primary.main',
                        display: 'flex',
                      }}
                    >
                      <AnalyticsRoundedIcon fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>
                        TOTAL CATEGORIZED ISSUES
                      </Typography>
                      {isLoading ? (
                        <Skeleton width={80} height={36} />
                      ) : (
                        <Typography variant="h5" fontWeight={800}>
                          {totalComplaintsInCategories}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        bgcolor: 'secondary.50',
                        color: 'secondary.main',
                        display: 'flex',
                      }}
                    >
                      <CategoryRoundedIcon fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>
                        ACTIVE CATEGORIES
                      </Typography>
                      {isLoading ? (
                        <Skeleton width={60} height={36} />
                      ) : (
                        <Typography variant="h5" fontWeight={800}>
                          {categories.length}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        bgcolor: 'warning.50',
                        color: 'warning.main',
                        display: 'flex',
                      }}
                    >
                      <EqualizerRoundedIcon fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>
                        HIGHEST VOLUME CATEGORY
                      </Typography>
                      {isLoading ? (
                        <Skeleton width={120} height={36} />
                      ) : (
                        <Typography variant="h6" fontWeight={800} noWrap sx={{ maxWidth: 220 }}>
                          {topCategory}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Category Analytics Section */}
          <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            {isLoading ? (
              <Skeleton height={350} variant="rounded" sx={{ borderRadius: 3 }} />
            ) : (
              <CategoryAnalyticsChart categories={categories} />
            )}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

export default AdminAnalyticsPage;
