import { memo } from 'react';
import { Chip } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';

const statusConfig = {
  PENDING: { color: 'warning', icon: <PendingActionsRoundedIcon />, label: 'Pending' },
  IN_PROGRESS: { color: 'info', icon: <HourglassTopRoundedIcon />, label: 'In progress' },
  RESOLVED: { color: 'success', icon: <CheckCircleRoundedIcon />, label: 'Resolved' },
  REJECTED: { color: 'error', icon: <ErrorOutlineRoundedIcon />, label: 'Rejected' },
};

function ComplaintStatusChip({ status }) {
  const { color, icon, label } = statusConfig[status] || { color: 'default', icon: null, label: status || 'Unknown' };

  return (
    <Chip
      color={color}
      icon={icon}
      label={label}
      size="small"
      sx={{ borderRadius: 1.5, fontWeight: 800 }}
      variant="filled"
    />
  );
}

export default memo(ComplaintStatusChip);

