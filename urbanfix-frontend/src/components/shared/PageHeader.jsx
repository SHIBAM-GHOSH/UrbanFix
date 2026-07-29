import { Box, Stack, Typography } from '@mui/material';

function PageHeader({ actions, eyebrow, subtitle, title }) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
      <Box>
        {eyebrow && (
          <Typography color="primary" fontWeight={800} variant="overline">
            {eyebrow}
          </Typography>
        )}
        <Typography component="h1" variant="h1">
          {title}
        </Typography>
        {subtitle && (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && (
        <Stack alignItems={{ xs: 'stretch', md: 'center' }} direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          {actions}
        </Stack>
      )}
    </Stack>
  );
}

export default PageHeader;
