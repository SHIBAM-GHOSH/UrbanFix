import { Chip } from '@mui/material';

const statusConfig = {
  PENDING: { color: 'warning', label: 'Pending' },
  IN_PROGRESS: { color: 'info', label: 'In progress' },
  RESOLVED: { color: 'success', label: 'Resolved' },
  REJECTED: { color: 'error', label: 'Rejected' },
};

function ComplaintStatusChip({ status }) {
  const { color, label } = statusConfig[status] || { color: 'default', label: status };

  return <Chip color={color} label={label} size="small" sx={{ fontWeight: 700 }} />;
}

export default ComplaintStatusChip;
