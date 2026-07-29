import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Container, Paper, Stack } from '@mui/material';
import ComplaintForm from '../../components/complaints/ComplaintForm';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import LoadingState from '../../components/shared/LoadingState';
import PageHeader from '../../components/shared/PageHeader';
import { useSnackbar } from '../../context/SnackbarContext';
import { getComplaintById, updateComplaint } from '../../services/complaintService';

function EditComplaintPage() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

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
          setError(
            requestError.response?.data?.message ||
              requestError.response?.data?.error ||
              'We could not load this complaint. It may have been removed or you do not have permission to view it.',
          );
        }
      }
    }

    loadComplaint();

    return () => {
      isMounted = false;
    };
  }, [complaintId]);

  async function handleSubmit({ image, ...updates }) {
    setError('');
    setIsSubmitting(true);

    try {
      await updateComplaint(complaintId, updates);
      showSuccess('Complaint updated successfully.');
      navigate(`/complaints/${complaintId}`, {
        replace: true,
        state: { message: 'Complaint updated successfully.' },
      });
    } catch (requestError) {
      const errMsg =
        requestError.response?.data?.message ||
        requestError.response?.data?.error ||
        'We could not update this complaint. Please verify field inputs.';
      setError(errMsg);
      showError('Unable to save complaint changes.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancelRequest() {
    if (isDirty) {
      setCancelDialogOpen(true);
    } else {
      navigate(`/complaints/${complaintId}`);
    }
  }

  function handleConfirmCancel() {
    setCancelDialogOpen(false);
    navigate(`/complaints/${complaintId}`);
  }

  if (!complaint && !error) {
    return <LoadingState message="Loading complaint details..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <PageHeader
          eyebrow="Update Report"
          subtitle="Modify complaint title, category, description, location, or image URL."
          title={`Edit Complaint #${complaintId}`}
        />

        {error && <Alert severity="error">{error}</Alert>}

        {complaint && complaint.status !== 'PENDING' && (
          <Alert severity="warning">
            This complaint is currently <strong>{complaint.status}</strong>. Updating details will inform the assigned municipal response team.
          </Alert>
        )}

        {complaint && (
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              p: { xs: 2.5, md: 4 },
            }}
          >
            <ComplaintForm
              allowImageUpload={false}
              cancelLabel="Discard Changes"
              initialValues={complaint}
              isSubmitting={isSubmitting}
              submitLabel="Save Changes"
              onCancel={handleCancelRequest}
              onDirtyChange={setIsDirty}
              onSubmit={handleSubmit}
            />
          </Paper>
        )}
      </Stack>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        cancelLabel="Keep Editing"
        confirmColor="error"
        confirmLabel="Discard Changes"
        description="You have unsaved changes. Are you sure you want to discard your edits and return to complaint details?"
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        open={cancelDialogOpen}
        title="Discard Unsaved Changes?"
      />
    </Container>
  );
}

export default EditComplaintPage;


