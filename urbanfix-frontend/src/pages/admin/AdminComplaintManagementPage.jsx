import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import AdminComplaintTable from '../../components/admin/AdminComplaintTable';
import { getAdminComplaints } from '../../services/adminService';
import { updateComplaintStatus } from '../../services/complaintService';

const STATUS_OPTIONS = ['', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

function AdminComplaintManagementPage() {
  const [filters, setFilters] = useState({ status: '', category: '' });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [complaintsPage, setComplaintsPage] = useState({ content: [], totalPages: 0, number: 0 });
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingComplaintId, setUpdatingComplaintId] = useState(null);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const queryParams = useMemo(() => {
    const params = {
      page,
      size: 10,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    };

    // Keep empty strings out of enum query params so Spring binding stays clean.
    if (appliedFilters.status) params.status = appliedFilters.status;
    if (appliedFilters.category.trim()) params.category = appliedFilters.category.trim();

    return params;
  }, [appliedFilters, page]);

  useEffect(() => {
    let isMounted = true;

    async function loadComplaints() {
      setIsLoading(true);
      setError('');

      try {
        const data = await getAdminComplaints(queryParams);
        if (isMounted) {
          setComplaintsPage(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Unable to load admin complaints.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadComplaints();

    return () => {
      isMounted = false;
    };
  }, [queryParams]);

  function handleApplyFilters(event) {
    event.preventDefault();
    setPage(0);
    setAppliedFilters(filters);
  }

  function handleResetFilters() {
    const cleared = { status: '', category: '' };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setPage(0);
  }

  function handleStatusChange(complaintId, status) {
    setPendingStatusUpdate({ complaintId, status });
  }

  async function confirmStatusChange() {
    if (!pendingStatusUpdate) return;

    const { complaintId, status } = pendingStatusUpdate;
    setUpdatingComplaintId(complaintId);
    setError('');
    setSuccess('');
    setPendingStatusUpdate(null);

    try {
      await updateComplaintStatus(complaintId, status);
      setComplaintsPage((current) => ({
        ...current,
        content: current.content.map((complaint) =>
          complaint.id === complaintId ? { ...complaint, status } : complaint
        ),
      }));
      setSuccess('Complaint status updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update complaint status.');
    } finally {
      setUpdatingComplaintId(null);
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)', py: { xs: 4, md: 5 } }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography fontWeight={900} variant="h4">
                Complaint Management
              </Typography>
              <Typography color="text.secondary">
                Review citizen reports, filter operational queues, and update resolution status.
              </Typography>
            </Box>
          </Stack>

          <Paper component="form" onSubmit={handleApplyFilters} sx={{ border: '1px solid #E8EDF4', borderRadius: 2, p: 2.5 }}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={filters.status}
                    onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <MenuItem key={status || 'ALL'} value={status}>
                        {status ? status.replace('_', ' ') : 'All statuses'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label="Category"
                  placeholder="Roads, Water Supply, Sanitation"
                  value={filters.category}
                  onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
                />
              </Grid>
              <Grid item md={5} xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button fullWidth startIcon={<ManageSearchRoundedIcon />} type="submit" variant="contained">
                    Apply filters
                  </Button>
                  <Button fullWidth onClick={handleResetFilters} startIcon={<RestartAltRoundedIcon />} variant="outlined">
                    Reset
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <AdminComplaintTable
            complaints={complaintsPage.content || []}
            isLoading={isLoading}
            updatingComplaintId={updatingComplaintId}
            onStatusChange={handleStatusChange}
          />

          <Dialog onClose={() => setPendingStatusUpdate(null)} open={Boolean(pendingStatusUpdate)}>
            <DialogTitle>Update complaint status?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This will change the complaint status to {pendingStatusUpdate?.status?.replace('_', ' ')}.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPendingStatusUpdate(null)}>Cancel</Button>
              <Button disabled={Boolean(updatingComplaintId)} onClick={confirmStatusChange} variant="contained">
                Confirm update
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            autoHideDuration={3200}
            message={success}
            open={Boolean(success)}
            onClose={() => setSuccess('')}
          />

          {complaintsPage.totalPages > 1 && (
            <Stack alignItems="center">
              <Pagination
                color="primary"
                count={complaintsPage.totalPages}
                page={page + 1}
                onChange={(_, value) => setPage(value - 1)}
              />
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default AdminComplaintManagementPage;
