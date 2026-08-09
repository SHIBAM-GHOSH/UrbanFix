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
import { getImageUrl } from '../../utils/imageUtils';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ComplaintStatusChip from '../complaints/ComplaintStatusChip';
import SeverityChip from '../complaints/SeverityChip';
import EmptyState from '../shared/EmptyState';

const STATUS_OPTIONS = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function AdminComplaintTable({ complaints = [], isLoading, updatingComplaintId, onStatusChange, onDelete }) {
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
            <TableCell sx={{ fontWeight: 800 }}>AI Severity</TableCell>
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
                      src={getImageUrl(complaint.imageUrl)}
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: 'grey.100',
                        border: '1px solid',
                        borderColor: 'divider',
                        flexShrink: 0,
                      }}
                    >
                      <ImageRoundedIcon fontSize="small" color="action" />
                    </Avatar>

                    <Box>
                      <Typography
                        component={RouterLink}
                        to={`/complaints/${complaint.id}`}
                        variant="subtitle2"
                        fontWeight={800}
                        sx={{
                          color: 'text.primary',
                          textDecoration: 'none',
                          '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                        }}
                      >
                        #{complaint.id} - {complaint.title}
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
                        <PlaceRoundedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 220 }}>
                          {complaint.location || 'Location Not Specified'}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Chip
                    label={complaint.category || 'General'}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>

                {/* AI Severity */}
                <TableCell>
                  <SeverityChip severity={complaint.severity} />
                </TableCell>

                {/* Reporter */}
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {complaint.userName || 'Anonymous'}
                  </Typography>
                </TableCell>

                {/* Current Status Chip */}
                <TableCell>
                  <ComplaintStatusChip status={complaint.status} size="small" />
                </TableCell>

                {/* Date */}
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(complaint.createdAt)}
                  </Typography>
                </TableCell>

                {/* Status Selector Dropdown */}
                <TableCell>
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

                {/* Action Links */}
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
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

                    {onDelete && (
                      <Tooltip title="Delete Complaint">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(complaint)}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8}>
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

