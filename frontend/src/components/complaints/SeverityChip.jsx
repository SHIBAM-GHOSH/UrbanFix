import { memo } from 'react';
import { Chip } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const severityConfig = {
  HIGH: { color: 'error', icon: <ReportProblemRoundedIcon />, label: 'HIGH' },
  MEDIUM: { color: 'warning', icon: <WarningAmberRoundedIcon />, label: 'MEDIUM' },
  LOW: { color: 'success', icon: <InfoOutlinedIcon />, label: 'LOW' },
};

function SeverityChip({ severity, size = 'small' }) {
  if (!severity) return null;
  const normalized = String(severity).toUpperCase();
  const { color, icon, label } = severityConfig[normalized] || {
    color: 'default',
    icon: null,
    label: severity,
  };

  return (
    <Chip
      color={color}
      icon={icon}
      label={label}
      size={size}
      sx={{ borderRadius: 1.5, fontWeight: 800 }}
      variant="filled"
    />
  );
}

export default memo(SeverityChip);
