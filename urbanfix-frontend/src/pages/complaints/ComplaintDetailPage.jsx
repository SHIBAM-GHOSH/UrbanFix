import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ComplaintStatusChip from '../../components/complaints/ComplaintStatusChip';
import { deleteComplaint, getComplaintById } from '../../services/complaintService';

function ComplaintDetailPage() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadComplaint() {
      try {
        setComplaint(await getComplaintById(complaintId));
      } catch (requestError) {
        setError(requestError.response?.data?.error || 'We could not load this complaint.');
      }
    }

    loadComplaint();
  }, [complaintId]);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteComplaint(complaintId);
      navigate('/complaints', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'We could not delete this complaint.');
      setIsDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

  if (!complaint && !error) {
    return <Box sx={{ display: 'grid', minHeight: '50vh', placeItems: 'center' }}><CircularProgress /></Box>;
  }

  if (error && !complaint) {
    return <Container sx={{ py: 5 }}><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}
        <Paper sx={{ overflow: 'hidden' }}>
          {complaint.imageUrl && <Box alt={complaint.title} component="img" src={complaint.imageUrl} sx={{ display: 'block', height: { xs: 220, sm: 340 }, objectFit: 'cover', width: '100%' }} />}
          <Stack spacing={3} sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack alignItems={{ sm: 'center' }} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
              <ComplaintStatusChip status={complaint.status} />
              <Typography color="text.secondary" variant="body2">
                Reported {new Date(complaint.createdAt).toLocaleString()}
              </Typography>
            </Stack>
            <Box>
              <Typography color="primary" fontWeight={700} variant="body2">{complaint.category}</Typography>
              <Typography component="h1" sx={{ mt: 0.5 }} variant="h1">{complaint.title}</Typography>
            </Box>
            <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{complaint.description}</Typography>
            <Stack alignItems="center" color="text.secondary" direction="row" spacing={1}>
              <LocationOnOutlinedIcon color="primary" />
              <Typography>{complaint.location}</Typography>
            </Stack>
            <Divider />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button component={RouterLink} startIcon={<EditOutlinedIcon />} to={`/complaints/${complaint.id}/edit`} variant="outlined">Edit complaint</Button>
              <Button color="error" onClick={() => setIsDeleteOpen(true)} startIcon={<DeleteOutlineRoundedIcon />}>Delete complaint</Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
      <Dialog onClose={() => setIsDeleteOpen(false)} open={isDeleteOpen}>
        <DialogTitle>Delete this complaint?</DialogTitle>
        <DialogContent><DialogContentText>This cannot be undone. The complaint will be permanently removed.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
          <Button color="error" disabled={isDeleting} onClick={handleDelete} variant="contained">{isDeleting ? 'Deleting…' : 'Delete'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ComplaintDetailPage;
