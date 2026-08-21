import { useEffect, useState } from 'react';
import { Box, Container, Alert } from '@mui/material';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import AdminRoutePlanner from '../../components/admin/AdminRoutePlanner';
import PageHeader from '../../components/shared/PageHeader';
import LoadingState from '../../components/shared/LoadingState';
import { useSnackbar } from '../../context/SnackbarContext';
import { getAdminComplaints } from '../../services/adminService';
import { updateComplaintStatus } from '../../services/complaintService';

function AdminRoutePlannerPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showSuccess, showError } = useSnackbar();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminComplaints({ size: 100 });
      setComplaints(Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load complaints for route planner:', err);
      setError(err?.response?.data?.message || 'Failed to load complaint data for route calculation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await updateComplaintStatus(complaintId, newStatus);
      showSuccess(`Complaint #${complaintId} status updated to ${newStatus}`);
      fetchComplaints();
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to update complaint status');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        actionLabel="Refresh Data"
        icon={<RouteRoundedIcon fontSize="large" />}
        subtitle="Calculate the optimal inspection path for field crews based on team specialization and location priority."
        title="Field Inspection Route Planner"
        onAction={fetchComplaints}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingState message="Loading inspection telemetry and routing coordinates..." minHeight="60vh" />
      ) : (
        <Box sx={{ mt: 2 }}>
          <AdminRoutePlanner complaints={complaints} onStatusUpdate={handleStatusUpdate} />
        </Box>
      )}
    </Container>
  );
}

export default AdminRoutePlannerPage;
