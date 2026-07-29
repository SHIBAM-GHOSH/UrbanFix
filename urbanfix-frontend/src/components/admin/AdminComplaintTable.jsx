import {
  Box,
  Chip,
  FormControl,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ComplaintStatusChip from '../complaints/ComplaintStatusChip';

const STATUS_OPTIONS = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

function AdminComplaintTable({ complaints, isLoading, updatingComplaintId, onStatusChange }) {
  return (
    <TableContainer component={Paper} sx={{ border: '1px solid #E8EDF4', borderRadius: 2, boxShadow: 'none' }}>
      {isLoading && <LinearProgress />}
      <Table sx={{ minWidth: 840 }}>
        <TableHead>
          <TableRow>
            <TableCell>Complaint</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Reporter</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Update</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {complaints.map((complaint) => (
            <TableRow hover key={complaint.id}>
              <TableCell>
                <Stack spacing={0.5}>
                  <Typography fontWeight={800}>{complaint.title}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {complaint.location || 'Location not provided'}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Chip color="primary" label={complaint.category || 'General'} size="small" variant="outlined" />
              </TableCell>
              <TableCell>{complaint.userName || 'Citizen'}</TableCell>
              <TableCell>
                <ComplaintStatusChip status={complaint.status} />
              </TableCell>
              <TableCell>
                {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'Not available'}
              </TableCell>
              <TableCell>
                <FormControl fullWidth size="small">
                  <Select
                    disabled={updatingComplaintId === complaint.id}
                    value={complaint.status || 'PENDING'}
                    onChange={(event) => onStatusChange(complaint.id, event.target.value)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          ))}
          {!complaints.length && !isLoading && (
            <TableRow>
              <TableCell colSpan={6}>
                <Box py={5} textAlign="center">
                  <Typography color="text.secondary">No complaints found for the selected filters.</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AdminComplaintTable;
