import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
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
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
          setError(err.response?.data?.message || 'Unable to load your profile. Please try refreshing.');
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
    return <LoadingState message="Loading account profile..." minHeight="60vh" />;
  }

  const isAdmin = profile?.role === 'ADMIN';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3.5}>
          <PageHeader
            eyebrow="Account Settings"
            subtitle="View your UrbanFix account details, authentication credentials, and platform access level."
            title="User Profile"
          />

          {error && <Alert severity="error">{error}</Alert>}

          {profile && (
            <Paper
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              {/* Profile Cover Header */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
                  color: '#FFFFFF',
                  px: { xs: 3, md: 5 },
                  py: { xs: 4, md: 5 },
                  position: 'relative',
                }}
              >
                <Stack alignItems={{ xs: 'flex-start', sm: 'center' }} direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <Avatar
                    sx={{
                      bgcolor: '#FFFFFF',
                      color: 'primary.main',
                      fontSize: 32,
                      fontWeight: 900,
                      height: 88,
                      width: 88,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                      border: '4px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    {initials}
                  </Avatar>
                  <Stack spacing={1}>
                    <Typography fontWeight={900} variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                      {profile.fullName}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {profile.email}
                    </Typography>
                    <Stack alignItems="center" direction="row" spacing={1} sx={{ pt: 0.5 }}>
                      <Chip
                        icon={isAdmin ? <AdminPanelSettingsRoundedIcon sx={{ color: '#FFFFFF !important' }} /> : <VerifiedUserRoundedIcon sx={{ color: '#FFFFFF !important' }} />}
                        label={isAdmin ? 'System Administrator' : 'Verified Citizen'}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          backdropFilter: 'blur(4px)',
                        }}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Box>

              {/* Profile Details Content */}
              <Box sx={{ p: { xs: 3, md: 5 } }}>
                <Typography variant="h3" fontWeight={800} sx={{ mb: 3 }}>
                  Account Information
                </Typography>

                <Grid container spacing={3}>
                  {/* User ID */}
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      elevation={0}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2.5,
                        height: '100%',
                        p: 2.5,
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1} color="primary.main">
                          <BadgeRoundedIcon />
                          <Typography color="text.secondary" fontWeight={800} variant="caption" sx={{ textTransform: 'uppercase' }}>
                            User ID
                          </Typography>
                        </Stack>
                        <Typography fontWeight={900} variant="h5">
                          #{profile.id}
                        </Typography>
                      </Stack>
                    </Card>
                  </Grid>

                  {/* Email */}
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      elevation={0}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2.5,
                        height: '100%',
                        p: 2.5,
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1} color="primary.main">
                          <EmailRoundedIcon />
                          <Typography color="text.secondary" fontWeight={800} variant="caption" sx={{ textTransform: 'uppercase' }}>
                            Email Address
                          </Typography>
                        </Stack>
                        <Typography fontWeight={900} variant="body1" noWrap>
                          {profile.email}
                        </Typography>
                      </Stack>
                    </Card>
                  </Grid>

                  {/* Access Level */}
                  <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <Card
                      elevation={0}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2.5,
                        height: '100%',
                        p: 2.5,
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1} color="primary.main">
                          <SecurityRoundedIcon />
                          <Typography color="text.secondary" fontWeight={800} variant="caption" sx={{ textTransform: 'uppercase' }}>
                            Access Level
                          </Typography>
                        </Stack>
                        <Typography fontWeight={900} variant="h5">
                          {isAdmin ? 'Full Admin Access' : 'Standard Citizen'}
                        </Typography>
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Alert severity="info" icon={<InfoOutlinedIcon />}>
                  <Typography variant="body2" fontWeight={600}>
                    Account Information is Read-Only
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Your profile details are managed securely via central authentication. Modifying profile credentials is not supported by the current OpenAPI backend contract.
                  </Typography>
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

