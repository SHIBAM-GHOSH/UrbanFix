import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Container, Paper, Stack } from '@mui/material';
import ComplaintForm from '../../components/complaints/ComplaintForm';
import PageHeader from '../../components/shared/PageHeader';
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
      navigate(`/complaints/${createdComplaint.id}`, {
        replace: true,
        state: { message: 'Complaint submitted successfully.' },
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          || requestError.response?.data?.error
          || 'We could not submit your complaint. Please check the details and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <PageHeader
          eyebrow="New report"
          subtitle="Add accurate details, coordinates, and optional photo evidence so the right team can respond faster."
          title="Report a civic issue"
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Paper sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2.5, md: 4 } }}>
          <ComplaintForm isSubmitting={isSubmitting} onSubmit={handleSubmit} submitLabel="Submit complaint" />
        </Paper>
      </Stack>
    </Container>
  );
}

export default CreateComplaintPage;
