import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import ImageNotSupportedRoundedIcon from '@mui/icons-material/ImageNotSupportedRounded';
import ComplaintStatusChip from '../../components/complaints/ComplaintStatusChip';
import SeverityChip from '../../components/complaints/SeverityChip';
import AppSnackbar from '../../components/shared/AppSnackbar';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import LoadingState from '../../components/shared/LoadingState';
import { deleteComplaint, getComplaintById } from '../../services/complaintService';
import ComplaintDetailMap from '../../components/maps/ComplaintDetailMap';

function formatDate(value) {
  if (!value) return 'Not available';
  return new Date(value).toLocaleString();
}

function MetadataItem({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.25}>
      <Box color="primary.main" sx={{ display: 'grid', pt: 0.25 }}>
        {icon}
      </Box>
      <Box>
        <Typography color="text.secondary" fontWeight={800} variant="caption">
          {label}
        </Typography>
        <Typography fontWeight={800}>{value || 'Not available'}</Typography>
      </Box>
    </Stack>
  );
}

import { getImageUrl } from '../../utils/imageUtils';

function ComplaintDetailPage() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ message: '', severity: 'success' });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadComplaint() {
      setError('');

      try {
        const data = await getComplaintById(complaintId);
        if (isMounted) {
          setComplaint(data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.response?.data?.message || requestError.response?.data?.error || 'We could not load this complaint.');
        }
      }
    }

    loadComplaint();

    return () => {
      isMounted = false;
    };
  }, [complaintId]);

  async function handleDelete() {
    setIsDeleting(true);
    setError('');

    try {
      await deleteComplaint(complaintId);
      setSnackbar({ message: 'Complaint deleted successfully.', severity: 'success' });
      navigate('/complaints', { replace: true, state: { message: 'Complaint deleted successfully.' } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.error || 'We could not delete this complaint.');
      setSnackbar({ message: 'Unable to delete complaint.', severity: 'error' });
      setIsDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

  if (!complaint && !error) {
    return <LoadingState message="Loading complaint..." />;
  }

  if (error && !complaint) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Stack alignItems="center" direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
              <ComplaintStatusChip status={complaint.status} />
              <SeverityChip severity={complaint.severity} />
              <Chip color="primary" label={complaint.category || 'General'} size="small" variant="outlined" />
            </Stack>
            <Typography component="h1" variant="h1">
              {complaint.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Complaint #{complaint.id}
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button component={RouterLink} startIcon={<EditOutlinedIcon />} to={`/complaints/${complaint.id}/edit`} variant="outlined">
              Edit complaint
            </Button>
            <Button color="error" onClick={() => setIsDeleteOpen(true)} startIcon={<DeleteOutlineRoundedIcon />} variant="outlined">
              Delete
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid item lg={7} xs={12}>
            <Paper sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
              {complaint.imageUrl ? (
                <Box
                  alt={complaint.title}
                  component="img"
                  src={getImageUrl(complaint.imageUrl)}
                  sx={{ display: 'block', height: { xs: 260, md: 520 }, objectFit: 'cover', width: '100%' }}
                />
              ) : (
                <Stack alignItems="center" color="text.secondary" justifyContent="center" spacing={1.5} sx={{ height: { xs: 260, md: 520 } }}>
                  <ImageNotSupportedRoundedIcon color="disabled" sx={{ fontSize: 56 }} />
                  <Typography>No image was uploaded for this complaint.</Typography>
                </Stack>
              )}
            </Paper>
          </Grid>

          <Grid item lg={5} xs={12}>
            <Stack spacing={2.5}>
              <Paper sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2.5, md: 3 } }}>
                <Typography gutterBottom variant="h3">
                  Description
                </Typography>
                <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {complaint.description}
                </Typography>
              </Paper>

              <Paper sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2.5, md: 3 } }}>
                <Typography gutterBottom variant="h3">
                  Location Map
                </Typography>
                <Stack spacing={2}>
                  <MetadataItem icon={<LocationOnOutlinedIcon />} label="Address or landmark" value={complaint.location} />
                  <MetadataItem
                    icon={<MyLocationRoundedIcon />}
                    label="Coordinates"
                    value={
                      complaint.latitude && complaint.longitude
                        ? `${complaint.latitude}, ${complaint.longitude}`
                        : 'Not available'
                    }
                  />
                  <Box sx={{ mt: 1 }}>
                    <ComplaintDetailMap
                      latitude={complaint.latitude}
                      longitude={complaint.longitude}
                      title={complaint.title}
                      status={complaint.status}
                      height={260}
                    />
                  </Box>
                </Stack>
              </Paper>

              <Paper sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2.5, md: 3 } }}>
                <Typography gutterBottom variant="h3">
                  Metadata
                </Typography>
                <Stack divider={<Divider flexItem />} spacing={2}>
                  <MetadataItem icon={<PersonOutlineRoundedIcon />} label="Reported by" value={complaint.userName || 'Citizen'} />
                  <MetadataItem icon={<CalendarMonthRoundedIcon />} label="Created" value={formatDate(complaint.createdAt)} />
                  <MetadataItem icon={<UpdateRoundedIcon />} label="Last updated" value={formatDate(complaint.updatedAt)} />
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Stack>

      <ConfirmDialog
        confirmColor="error"
        confirmLabel="Delete"
        description="This cannot be undone. The complaint will be permanently removed."
        isConfirming={isDeleting}
        open={isDeleteOpen}
        title="Delete this complaint?"
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <AppSnackbar
        message={snackbar.message}
        open={Boolean(snackbar.message)}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ message: '', severity: 'success' })}
      />
    </Container>
  );
}

export default ComplaintDetailPage;
