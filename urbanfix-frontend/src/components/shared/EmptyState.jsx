import { Box, Button, Paper, Stack, Typography } from '@mui/material';

function EmptyState({ action, actionLabel, description, icon, onAction, title = 'Nothing here yet' }) {
  return (
    <Paper sx={{ border: '1px dashed', borderColor: 'divider', p: { xs: 4, md: 5 }, textAlign: 'center' }}>
      <Stack alignItems="center" spacing={1.5}>
        {icon && (
          <Box color="primary.main" sx={{ display: 'grid', fontSize: 40, placeItems: 'center' }}>
            {icon}
          </Box>
        )}
        <Typography variant="h3">{title}</Typography>
        {description && (
          <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
            {description}
          </Typography>
        )}
        {(action || onAction) && actionLabel && (
          <Button component={action} onClick={onAction} sx={{ mt: 1 }} variant="contained">
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

export default EmptyState;
