import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import AdminComplaintTable from '../../components/admin/AdminComplaintTable';
import AdminRoutePlanner from '../../components/admin/AdminRoutePlanner';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import PageHeader from '../../components/shared/PageHeader';
import { useSnackbar } from '../../context/SnackbarContext';
import { getAdminComplaints } from '../../services/adminService';
import { updateComplaintStatus, deleteComplaint } from '../../services/complaintService';

const STATUS_OPTIONS = ['', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

const QUICK_CATEGORIES = [
  'Roads & Traffic',
  'Sanitation & Waste',
  'Water Supply',
  'Electrical & Lighting',
  'Public Parks',
  'Noise & Pollution',
];

function AdminComplaintManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError } = useSnackbar();

  const initialStatus = searchParams.get('status') || '';
  const initialCategory = searchParams.get('category') || '';

  const [filters, setFilters] = useState({ status: initialStatus, category: initialCategory });
  const [appliedFilters, setAppliedFilters] = useState({ status: initialStatus, category: initialCategory });
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingComplaintId, setUpdatingComplaintId] = useState(null);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [pendingDeleteComplaint, setPendingDeleteComplaint] = useState(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('table');

  // Sync state if URL search parameters change externally
  useEffect(() => {
    const urlStatus = searchParams.get('status') || '';
    const urlCategory = searchParams.get('category') || '';
    setFilters({ status: urlStatus, category: urlCategory });
    setAppliedFilters({ status: urlStatus, category: urlCategory });
  }, [searchParams]);

  const queryParams = useMemo(() => {
    const params = {};
    if (appliedFilters.status) params.status = appliedFilters.status;
    if (appliedFilters.category.trim()) params.category = appliedFilters.category.trim();
    return params;
  }, [appliedFilters]);

  useEffect(() => {
    let isMounted = true;

    async function loadComplaints() {
      setIsLoading(true);
      setError('');

      try {
        const data = await getAdminComplaints(queryParams);
        if (isMounted) {
          setComplaints(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message || err.response?.data?.error || 'Unable to load admin complaint list.',
          );
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

  function handleFilterSubmit(event) {
    event.preventDefault();
    setAppliedFilters(filters);

    const nextParams = {};
    if (filters.status) nextParams.status = filters.status;
    if (filters.category.trim()) nextParams.category = filters.category.trim();
    setSearchParams(nextParams);
  }

  function handleQuickCategoryClick(categoryName) {
    const nextCategory = filters.category === categoryName ? '' : categoryName;
    const updated = { ...filters, category: nextCategory };
    setFilters(updated);
    setAppliedFilters(updated);

    const nextParams = {};
    if (updated.status) nextParams.status = updated.status;
    if (updated.category.trim()) nextParams.category = updated.category.trim();
    setSearchParams(nextParams);
  }

  function handleResetFilters() {
    const cleared = { status: '', category: '' };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setSearchParams({});
  }

  function handleStatusChange(complaintId, status) {
    setPendingStatusUpdate({ complaintId, status });
  }

  async function confirmStatusChange() {
    if (!pendingStatusUpdate) return;

    const { complaintId, status } = pendingStatusUpdate;
    setUpdatingComplaintId(complaintId);
    setError('');
    setPendingStatusUpdate(null);

    try {
      await updateComplaintStatus(complaintId, status);
      setComplaints((current) =>
        current.map((c) => (c.id === complaintId ? { ...c, status } : c)),
      );
      showSuccess(`Complaint #${complaintId} status updated to ${status.replace('_', ' ')}.`);
    } catch (err) {
      const errMsg =
        err.response?.data?.message || err.response?.data?.error || 'Unable to update complaint status.';
      setError(errMsg);
      showError('Failed to update complaint status.');
    } finally {
      setUpdatingComplaintId(null);
    }
  }

  async function confirmDeleteComplaint() {
    if (!pendingDeleteComplaint) return;

    const targetId = pendingDeleteComplaint.id;
    setPendingDeleteComplaint(null);
    setError('');

    try {
      await deleteComplaint(targetId);
      setComplaints((current) => current.filter((c) => c.id !== targetId));
      showSuccess(`Complaint #${targetId} deleted successfully.`);
    } catch (err) {
      const errMsg =
        err.response?.data?.message || err.response?.data?.error || 'Unable to delete complaint.';
      setError(errMsg);
      showError('Failed to delete complaint.');
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        <Stack spacing={3.5}>
          <PageHeader
            eyebrow="Triage & Operations"
            subtitle="Review incoming citizen complaints, filter queue records, and update status."
            title="Complaint Management"
          />

          {error && <Alert severity="error">{error}</Alert>}

          {/* Filter Bar Panel */}
          <Paper
            component="form"
            elevation={0}
            onSubmit={handleFilterSubmit}
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FilterListRoundedIcon color="action" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={700}>
                  Filter Options
                </Typography>
              </Stack>

              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                  <TextField
                    fullWidth
                    label="Filter by Category"
                    placeholder="e.g. Sanitation, Roads, Water..."
                    size="small"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="admin-status-filter-label">Status Filter</InputLabel>
                    <Select
                      label="Status Filter"
                      labelId="admin-status-filter-label"
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                      <MenuItem value="RESOLVED">Resolved</MenuItem>
                      <MenuItem value="REJECTED">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      fullWidth
                      startIcon={<ManageSearchRoundedIcon />}
                      type="submit"
                      variant="contained"
                    >
                      Apply Filters
                    </Button>

                    <Button
                      color="inherit"
                      onClick={handleResetFilters}
                      sx={{ minWidth: 40, px: 1 }}
                      title="Reset filters"
                    >
                      <RestartAltRoundedIcon fontSize="small" />
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

              {/* Quick Category Chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pt: 0.5 }}>
                {QUICK_CATEGORIES.map((cat) => {
                  const isSelected = filters.category.toLowerCase() === cat.toLowerCase();
                  return (
                    <Chip
                      key={cat}
                      clickable
                      color={isSelected ? 'primary' : 'default'}
                      label={cat}
                      size="small"
                      variant={isSelected ? 'filled' : 'outlined'}
                      onClick={() => handleQuickCategoryClick(cat)}
                    />
                  );
                })}
              </Box>
            </Stack>
          </Paper>

          {/* View mode toggle (Table vs Route Planner) */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Showing <strong>{complaints.length}</strong> complaints
            </Typography>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, next) => next && setViewMode(next)}
              size="small"
              sx={{ bgcolor: 'background.paper' }}
            >
              <ToggleButton value="table" aria-label="Table View">
                <TableRowsRoundedIcon fontSize="small" sx={{ mr: 0.75 }} /> Triage Table
              </ToggleButton>
              <ToggleButton value="planner" aria-label="Field Route Planner">
                <RouteRoundedIcon fontSize="small" sx={{ mr: 0.75 }} /> Field Route Planner
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {viewMode === 'planner' ? (
            <AdminRoutePlanner
              complaints={complaints}
              onStatusUpdate={(complaintId, nextStatus) => {
                setPendingStatusUpdate({ complaintId, status: nextStatus });
              }}
            />
          ) : (
            <AdminComplaintTable
              complaints={complaints}
              isLoading={isLoading}
              updatingComplaintId={updatingComplaintId}
              onStatusChange={handleStatusChange}
              onDelete={(complaint) => setPendingDeleteComplaint(complaint)}
            />
          )}

          {/* Status Update Confirmation Modal */}
          <ConfirmDialog
            confirmLabel="Confirm Update"
            description={`Are you sure you want to change the status of complaint #${pendingStatusUpdate?.complaintId} to ${pendingStatusUpdate?.status?.replace('_', ' ')}?`}
            isConfirming={Boolean(updatingComplaintId)}
            onCancel={() => setPendingStatusUpdate(null)}
            onConfirm={confirmStatusChange}
            open={Boolean(pendingStatusUpdate)}
            title="Update Complaint Status"
          />

          {/* Delete Complaint Confirmation Modal */}
          <ConfirmDialog
            confirmLabel="Delete Complaint"
            description={`Are you sure you want to permanently delete complaint #${pendingDeleteComplaint?.id} - "${pendingDeleteComplaint?.title}"? This action cannot be undone.`}
            onCancel={() => setPendingDeleteComplaint(null)}
            onConfirm={confirmDeleteComplaint}
            open={Boolean(pendingDeleteComplaint)}
            title="Delete Complaint"
          />
        </Stack>
      </Container>
    </Box>
  );
}

export default AdminComplaintManagementPage;
