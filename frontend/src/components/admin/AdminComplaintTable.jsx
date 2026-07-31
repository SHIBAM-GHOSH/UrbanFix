import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Chip,
  FormControl,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import ComplaintStatusChip from '../complaints/ComplaintStatusChip';
import EmptyState from '../shared/EmptyState';

const STATUS_OPTIONS = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function AdminComplaintTable({ complaints = [], isLoading, updatingComplaintId, onStatusChange }) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {isLoading && <LinearProgress />}

      <Table sx={{ minWidth: 900 }}>
        <TableHead sx={{ bgcolor: 'grey.50' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>ID & Title</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Reporter</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Current Status</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Date Reported</TableCell>
            <TableCell sx={{ fontWeight: 800, textAlign: 'center' }}>Update Status</TableCell>
            <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading && complaints.length === 0 ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={`skel-${idx}`}>
                <TableCell><Skeleton height={40} width={220} /></TableCell>
                <TableCell><Skeleton height={30} width={90} /></TableCell>
                <TableCell><Skeleton height={30} width={100} /></TableCell>
                <TableCell><Skeleton height={30} width={90} /></TableCell>
                <TableCell><Skeleton height={30} width={90} /></TableCell>
                <TableCell><Skeleton height={40} width={120} /></TableCell>
                <TableCell><Skeleton height={30} width={40} /></TableCell>
              </TableRow>
            ))
          ) : complaints.length > 0 ? (
            complaints.map((complaint) => (
              <TableRow
                hover
                key={complaint.id}
                sx={{
                  transition: 'background-color 0.15s ease',
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {/* Title & Photo Thumbnail */}
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar
                      variant="rounded"
                      src={complaint.imageUrl || ''}
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: 'grey.100',
                        border: '1px solid',
                        borderColor: 'divider',
                        flexShrink: 0,
                      }}
                    >
                      <ImageRoundedIcon color="disabled" fontSize="small" />
                    </Avatar>

                    <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                      <Typography
                        component={RouterLink}
                        to={`/complaints/${complaint.id}`}
                        fontWeight={800}
                        variant="body2"
                        noWrap
                        sx={{
                          color: 'text.primary',
                          textDecoration: 'none',
                          maxWidth: 280,
                          '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                        }}
                      >
                        #{complaint.id} - {complaint.title}
                      </Typography>
                      {complaint.location && (
                        <Stack direction="row" alignItems="center" spacing={0.25} color="text.secondary">
                          <PlaceRoundedIcon sx={{ fontSize: 13 }} color="action" />
                          <Typography variant="caption" noWrap sx={{ maxWidth: 220 }}>
                            {complaint.location}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Chip
                    color="primary"
                    label={complaint.category || 'General'}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>

                {/* Reporter */}
                <TableCell>
                  <Typography fontWeight={600} variant="body2">
                    {complaint.userName || 'Citizen'}
                  </Typography>
                </TableCell>

                {/* Current Status Chip */}
                <TableCell>
                  <ComplaintStatusChip status={complaint.status} />
                </TableCell>

                {/* Date */}
                <TableCell>
                  <Typography color="text.secondary" variant="caption" fontWeight={600}>
                    {formatDate(complaint.createdAt)}
                  </Typography>
                </TableCell>

                {/* Status Selector Dropdown */}
                <TableCell textAlign="center">
                  <FormControl fullWidth size="small">
                    <Select
                      disabled={updatingComplaintId === complaint.id}
                      value={complaint.status || 'PENDING'}
                      onChange={(event) => onStatusChange(complaint.id, event.target.value)}
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                        fontSize: '0.8125rem',
                      }}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <MenuItem key={status} value={status} sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                          {status.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>

                {/* Action Link */}
                <TableCell align="right">
                  <Tooltip title="View Complaint Details">
                    <IconButton
                      component={RouterLink}
                      to={`/complaints/${complaint.id}`}
                      size="small"
                      color="primary"
                    >
                      <VisibilityRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7}>
                <Box py={4}>
                  <EmptyState
                    description="No complaints match the specified status or category filters."
                    title="No Complaints Found"
                  />
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

