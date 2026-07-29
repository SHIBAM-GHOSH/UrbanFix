import { useEffect, useState } from 'react';
import {
  Alert,
  Container,
  Grid,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
} from '@mui/material';
import ComplaintCard from '../../components/complaints/ComplaintCard';
import EmptyState from '../../components/shared/EmptyState';
import FilterPanel from '../../components/shared/FilterPanel';
import PageHeader from '../../components/shared/PageHeader';
import PaginationControls from '../../components/shared/PaginationControls';
import SearchToolbar from '../../components/shared/SearchToolbar';
import { getMyComplaints } from '../../services/complaintService';

const initialFilters = {
  category: '',
  keyword: '',
  status: '',
};

function ComplaintListPage() {
  const [complaintPage, setComplaintPage] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadComplaints() {
      setError('');
      setComplaintPage(null);

      try {
        const response = await getMyComplaints({
          ...appliedFilters,
          direction: 'desc',
          page,
          size: 9,
          sortBy: 'createdAt',
        });
        setComplaintPage(response);
      } catch (requestError) {
        setError(requestError.response?.data?.error || 'We could not load your complaints.');
      }
    }

    loadComplaints();
  }, [appliedFilters, page]);

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
  }

  function handleFilterSubmit(event) {
    event.preventDefault();
    setPage(0);
    setAppliedFilters(filters);
  }

  function clearFilters() {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPage(0);
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <PageHeader
          eyebrow="Your reports"
          subtitle="Review and track every civic issue you have reported."
          title="My complaints"
        />

        <FilterPanel onSubmit={handleFilterSubmit}>
          <SearchToolbar onReset={clearFilters}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField fullWidth label="Search reports" name="keyword" onChange={handleFilterChange} placeholder="Title or description" value={filters.keyword} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField fullWidth label="Category" name="category" onChange={handleFilterChange} placeholder="e.g. Roads" value={filters.category} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField fullWidth label="Status" name="status" onChange={handleFilterChange} select value={filters.status}>
                <MenuItem value="">All statuses</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="IN_PROGRESS">In progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </TextField>
            </Grid>
          </SearchToolbar>
        </FilterPanel>

        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2.5}>
          {!complaintPage && !error && Array.from({ length: 6 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Skeleton height={330} variant="rounded" />
            </Grid>
          ))}
          {complaintPage?.content.map((complaint) => (
            <Grid key={complaint.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <ComplaintCard complaint={complaint} />
            </Grid>
          ))}
        </Grid>

        {complaintPage?.empty && (
          <EmptyState
            description="Adjust your filters or create a new report when you spot an issue."
            title="No matching reports found"
          />
        )}

        {complaintPage && (
          <PaginationControls
            currentPage={complaintPage.number}
            totalPages={complaintPage.totalPages}
            onChange={setPage}
          />
        )}
      </Stack>
    </Container>
  );
}

export default ComplaintListPage;
