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
import PaginationControls from '../../components/shared/PaginationControls';
import PageHeader from '../../components/shared/PageHeader';
import { useSnackbar } from '../../context/SnackbarContext';
import { getAdminComplaints } from '../../services/adminService';
import { updateComplaintStatus } from '../../services/complaintService';

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
  const [complaintsPage, setComplaintsPage] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0 });
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingComplaintId, setUpdatingComplaintId] = useState(null);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('table');

  // Sync state if URL search parameters change externally
  useEffect(() => {
    const urlStatus = searchParams.get('status') || '';
    const urlCategory = searchParams.get('category') || '';
    setFilters({ status: urlStatus, category: urlCategory });
    setAppliedFilters({ status: urlStatus, category: urlCategory });
    setPage(0);
  }, [searchParams]);

  const queryParams = useMemo(() => {
    const params = {
      page,
      size: 10,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    };

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
          setComplaintsPage(data || { content: [], totalPages: 0, number: 0, totalElements: 0 });
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

  function handleApplyFilters(event) {
    if (event) event.preventDefault();
    setPage(0);
    setAppliedFilters(filters);

    const nextParams = {};
    if (filters.status) nextParams.status = filters.status;
    if (filters.category.trim()) nextParams.category = filters.category.trim();
    setSearchParams(nextParams);
  }

  function handleQuickCategoryClick(cat) {
    const nextCategory = filters.category.toLowerCase() === cat.toLowerCase() ? '' : cat;
    const nextFilters = { ...filters, category: nextCategory };
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPage(0);

    const nextParams = {};
    if (nextFilters.status) nextParams.status = nextFilters.status;
    if (nextFilters.category.trim()) nextParams.category = nextFilters.category.trim();
    setSearchParams(nextParams);
  }

  function handleResetFilters() {
    const cleared = { status: '', category: '' };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setPage(0);
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
      setComplaintsPage((current) => ({
        ...current,
        content: (current.content || []).map((complaint) =>
          complaint.id === complaintId ? { ...complaint, status } : complaint,
        ),
      }));
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
            onSubmit={handleApplyFilters}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              p: { xs: 2.5, md: 3 },
            }}
          >
            <Stack spacing={2.5}>
              <Grid container spacing={2}>
                {/* Status Dropdown */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                      label="Filter by Status"
                      value={filters.status}
                      onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                      sx={{ borderRadius: 2 }}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <MenuItem key={st || 'ALL'} value={st}>
                          {st ? st.replace('_', ' ') : 'All Statuses'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Category Input */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Category / Keyword"
                    placeholder="Roads, Water, Sanitation..."
                    size="small"
                    value={filters.category}
                    onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Submit & Reset Buttons */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      fullWidth
                      startIcon={<FilterListRoundedIcon />}
                      type="submit"
                      variant="contained"
                      sx={{ borderRadius: 2 }}
                    >
                      Apply Filters
                    </Button>
                    <Button
                      fullWidth
                      onClick={handleResetFilters}
                      startIcon={<RestartAltRoundedIcon />}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      Reset
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

              {/* Quick Category Chips */}
              <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, mr: 0.5 }}>
                  Quick Category Filters:
                </Typography>
                {QUICK_CATEGORIES.map((cat) => {
                  const isSelected = filters.category.toLowerCase() === cat.toLowerCase();
                  return (
                    <Chip
                      key={cat}
                      color={isSelected ? 'primary' : 'default'}
                      label={cat}
                      onClick={() => handleQuickCategoryClick(cat)}
                      size="small"
                      variant={isSelected ? 'filled' : 'outlined'}
                      sx={{ cursor: 'pointer', fontWeight: 600 }}
                    />
                  );
                })}
              </Stack>
            </Stack>
          </Paper>

          {/* Results Summary Header & View Toggle */}
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={1.5}>
            <Typography color="text.secondary" variant="body2" fontWeight={700}>
              Showing {complaintsPage.content?.length || 0} of {complaintsPage.totalElements || 0} complaints
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
              complaints={complaintsPage.content || []}
              onStatusUpdate={(complaintId, nextStatus) => {
                setPendingStatusUpdate({ complaintId, status: nextStatus });
              }}
            />
          ) : (
            <>
              {/* Complaint Table */}
              <AdminComplaintTable
                complaints={complaintsPage.content || []}
                isLoading={isLoading}
                updatingComplaintId={updatingComplaintId}
                onStatusChange={handleStatusChange}
              />

              {/* Pagination Controls */}
              {complaintsPage.totalPages > 1 && (
                <PaginationControls
                  currentPage={page}
                  totalPages={complaintsPage.totalPages}
                  onChange={setPage}
                />
              )}
            </>
          )}

          {/* Status Update Confirmation Modal */}
          <ConfirmDialog
            confirmLabel="Confirm Update"
            description={`Are you sure you want to change the status of complaint #${pendingStatusUpdate?.complaintId} to ${pendingStatusUpdate?.status?.replace('_', ' ')}?`}
            isConfirming={Boolean(updatingComplaintId)}
            open={Boolean(pendingStatusUpdate)}
            title="Update Complaint Status"
            onClose={() => setPendingStatusUpdate(null)}
            onConfirm={confirmStatusChange}
          />
        </Stack>
      </Container>
    </Box>
  );
}

export default AdminComplaintManagementPage;


