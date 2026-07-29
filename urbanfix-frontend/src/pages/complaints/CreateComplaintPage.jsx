import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Container, Paper, Stack, Typography } from '@mui/material';
import ComplaintForm from '../../components/complaints/ComplaintForm';
import { createComplaint } from '../../services/complaintService';

function CreateComplaintPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit({ image, ...complaint }) {
    setError('');
    setIsSubmitting(true);

    try {
      const createdComplaint = await createComplaint(complaint, image);
      navigate(`/complaints/${createdComplaint.id}`, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'We could not submit your complaint.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <div>
          <Typography color="primary" fontWeight={800} variant="overline">New report</Typography>
          <Typography component="h1" variant="h1">Report a civic issue</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Add accurate details so the right team can understand and respond to the issue.
          </Typography>
        </div>
        {error && <Alert severity="error">{error}</Alert>}
        <Paper sx={{ p: { xs: 2.5, md: 4 } }}>
          <ComplaintForm isSubmitting={isSubmitting} onSubmit={handleSubmit} submitLabel="Submit complaint" />
        </Paper>
      </Stack>
    </Container>
  );
}

export default CreateComplaintPage;
