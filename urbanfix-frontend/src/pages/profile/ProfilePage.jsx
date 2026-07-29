import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import { getCurrentUser } from '../../services/userService';
import LoadingState from '../../components/shared/LoadingState';
import PageHeader from '../../components/shared/PageHeader';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setError('');

      try {
        const data = await getCurrentUser();
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Unable to load your profile.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const initials = useMemo(() => {
    if (!profile?.fullName) return 'UF';
    return profile.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }, [profile]);

  if (isLoading) {
    return <LoadingState message="Loading profile..." minHeight="60vh" />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <PageHeader subtitle="Your UrbanFix account details and access role." title="Profile" />

          {error && <Alert severity="error">{error}</Alert>}

          {profile && (
            <Paper sx={{ border: '1px solid #E8EDF4', borderRadius: 2, overflow: 'hidden' }}>
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  px: { xs: 3, md: 4 },
                  py: { xs: 3, md: 4 },
                }}
              >
                <Stack alignItems={{ xs: 'flex-start', sm: 'center' }} direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                  <Avatar sx={{ bgcolor: 'primary.contrastText', color: 'primary.main', fontSize: 28, fontWeight: 900, height: 78, width: 78 }}>
                    {initials}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={900} variant="h4">
                      {profile.fullName}
                    </Typography>
                    <Stack alignItems="center" direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        icon={<VerifiedUserRoundedIcon />}
                        label={profile.role}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'inherit', fontWeight: 800 }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Grid container spacing={3}>
                  <Grid item md={4} xs={12}>
                    <Stack spacing={1}>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <BadgeRoundedIcon color="primary" />
                        <Typography color="text.secondary" fontWeight={800} variant="body2">
                          User ID
                        </Typography>
                      </Stack>
                      <Typography fontWeight={800}>{profile.id}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Stack spacing={1}>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <EmailRoundedIcon color="primary" />
                        <Typography color="text.secondary" fontWeight={800} variant="body2">
                          Email
                        </Typography>
                      </Stack>
                      <Typography fontWeight={800}>{profile.email}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Stack spacing={1}>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <VerifiedUserRoundedIcon color="primary" />
                        <Typography color="text.secondary" fontWeight={800} variant="body2">
                          Access
                        </Typography>
                      </Stack>
                      <Typography fontWeight={800}>{profile.role === 'ADMIN' ? 'Administrator' : 'Citizen'}</Typography>
                    </Stack>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Alert severity="info">
                  Profile editing is not enabled because the current OpenAPI contract only exposes a read-only profile endpoint.
                </Alert>
              </Box>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default ProfilePage;
