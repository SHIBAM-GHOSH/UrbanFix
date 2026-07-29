import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import ComplaintCard from '../../components/complaints/ComplaintCard';
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
        <Box>
          <Typography color="primary" fontWeight={800} variant="overline">
            Your reports
          </Typography>
          <Typography component="h1" variant="h1">
            My complaints
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Review and track every civic issue you have reported.
          </Typography>
        </Box>

        <Paper component="form" onSubmit={handleFilterSubmit} sx={{ p: 2 }}>
          <Grid alignItems="center" container spacing={1.5}>
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
            <Grid size={{ xs: 12, md: 2 }}>
              <Stack direction="row" spacing={1}>
                <Button fullWidth startIcon={<FilterAltRoundedIcon />} type="submit" variant="contained">
                  Apply
                </Button>
                <Button onClick={clearFilters}>Clear</Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

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
          <Paper sx={{ p: 5, textAlign: 'center' }}>
            <Typography variant="h3">No matching reports found</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Adjust your filters or create a new report when you spot an issue.
            </Typography>
          </Paper>
        )}

        {complaintPage && complaintPage.totalPages > 1 && (
          <Stack alignItems="center">
            <Pagination
              color="primary"
              count={complaintPage.totalPages}
              onChange={(_, selectedPage) => setPage(selectedPage - 1)}
              page={complaintPage.number + 1}
            />
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

export default ComplaintListPage;
