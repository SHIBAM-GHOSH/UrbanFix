import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import FolderOffRoundedIcon from '@mui/icons-material/FolderOffRounded';

function renderPresetIcon(type) {
  switch (type) {
    case 'search':
      return <SearchOffRoundedIcon sx={{ fontSize: 44 }} />;
    case 'analytics':
      return <AnalyticsRoundedIcon sx={{ fontSize: 44 }} />;
    case 'complaints':
      return <InboxRoundedIcon sx={{ fontSize: 44 }} />;
    default:
      return <FolderOffRoundedIcon sx={{ fontSize: 44 }} />;
  }
}

function EmptyState({
  action,
  actionIcon,
  actionLabel,
  description,
  icon,
  onAction,
  title = 'Nothing here yet',
  to,
  type = 'default',
  variant = 'dashed',
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: variant === 'transparent' ? 'transparent' : 'background.paper',
        border: variant === 'dashed' ? '2px dashed' : '1px solid',
        borderColor: 'divider',
        borderRadius: 4,
        p: { xs: 4, md: 6 },
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <Box
          sx={{
            alignItems: 'center',
            bgcolor: 'primary.light',
            borderRadius: '50%',
            color: 'primary.main',
            display: 'flex',
            height: 80,
            justifyContent: 'center',
            width: 80,
          }}
        >
          {icon || renderPresetIcon(type)}
        </Box>

        <Stack spacing={0.5} sx={{ maxWidth: 480 }}>
          <Typography fontWeight={800} variant="h3">
            {title}
          </Typography>
          {description && (
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
          )}
        </Stack>

        {(action || onAction || to) && actionLabel && (
          <Button
            component={to ? RouterLink : action || 'button'}
            onClick={onAction}
            startIcon={actionIcon}
            sx={{ borderRadius: 2, mt: 1 }}
            to={to}
            variant="contained"
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

export default EmptyState;

