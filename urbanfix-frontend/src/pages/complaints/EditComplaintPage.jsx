import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Container, Paper, Stack, Typography } from '@mui/material';
import ComplaintForm from '../../components/complaints/ComplaintForm';
import { getComplaintById, updateComplaint } from '../../services/complaintService';
import LoadingState from '../../components/shared/LoadingState';

function EditComplaintPage() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSubmit({ image, ...updates }) {
    setError('');
    setIsSubmitting(true);

    try {
      // The current update endpoint accepts imageUrl, not a replacement file.
      await updateComplaint(complaintId, updates);
      navigate(`/complaints/${complaintId}`, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'We could not update this complaint.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!complaint && !error) {
    return <LoadingState message="Loading complaint..." />;
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <div>
          <Typography color="primary" fontWeight={800} variant="overline">Update report</Typography>
          <Typography component="h1" variant="h1">Edit complaint</Typography>
        </div>
        {error && <Alert severity="error">{error}</Alert>}
        {complaint && <Paper sx={{ p: { xs: 2.5, md: 4 } }}><ComplaintForm initialValues={complaint} isSubmitting={isSubmitting} onSubmit={handleSubmit} submitLabel="Save changes" /></Paper>}
      </Stack>
    </Container>
  );
}

export default EditComplaintPage;
