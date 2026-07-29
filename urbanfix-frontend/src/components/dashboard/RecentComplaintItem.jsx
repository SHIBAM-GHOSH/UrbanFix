import { Link as RouterLink } from 'react-router-dom';
import { Box, Chip, IconButton, Paper, Stack, Typography } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';

const STATUS_COLORS = {
  PENDING: { bg: '#FEF3C7', color: '#D97706', label: 'Pending' },
  IN_PROGRESS: { bg: '#EDE9FE', color: '#7C3AED', label: 'In Progress' },
  RESOLVED: { bg: '#D1FAE5', color: '#059669', label: 'Resolved' },
  REJECTED: { bg: '#F3F4F6', color: '#4B5563', label: 'Rejected' },
};

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function RecentComplaintItem({ complaint }) {
  const statusCfg = STATUS_COLORS[complaint.status] || {
    bg: '#E2E8F0',
    color: '#334155',
    label: complaint.status,
  };

  return (
    <Paper
      elevation={0}
      component={RouterLink}
      to={`/complaints/${complaint.id}`}
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
          boxShadow: '0 4px 16px rgba(124, 58, 237, 0.08)',
          transform: 'translateX(4px)',
        },
      }}
    >
      <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1, pr: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          <Typography fontWeight={800} variant="body1" noWrap sx={{ maxWidth: { xs: 200, sm: 380, md: 500 } }}>
            {complaint.title}
          </Typography>
          <Chip
            label={statusCfg.label}
            size="small"
            sx={{
              bgcolor: statusCfg.bg,
              color: statusCfg.color,
              fontWeight: 800,
              fontSize: '0.725rem',
              height: 22,
            }}
          />
          {complaint.category && (
            <Chip
              label={complaint.category}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.725rem', height: 22 }}
            />
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2} color="text.secondary">
          {complaint.location && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <PlaceRoundedIcon sx={{ fontSize: 16 }} color="action" />
              <Typography variant="caption" noWrap sx={{ maxWidth: { xs: 140, sm: 260 } }}>
                {complaint.location}
              </Typography>
            </Stack>
          )}
          <Typography variant="caption" color="text.disabled">
            • {formatDate(complaint.createdAt)}
          </Typography>
        </Stack>
      </Stack>

      <Box sx={{ flexShrink: 0 }}>
        <IconButton size="small" color="primary">
          <ChevronRightRoundedIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default RecentComplaintItem;
