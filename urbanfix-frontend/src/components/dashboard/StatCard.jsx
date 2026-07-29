import { memo } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

function StatCard({ color, icon, label, subtitle, value }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        height: '100%',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
          transform: 'translateY(-3px)',
        },
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Stack spacing={2}>
          <Stack alignItems="center" direction="row" justifyContent="space-between">
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: `${color}14`,
                border: '1px solid',
                borderColor: `${color}30`,
                borderRadius: 2.5,
                color,
                display: 'flex',
                height: 52,
                justifyContent: 'center',
                width: 52,
              }}
            >
              {icon}
            </Box>
            <Typography color="text.secondary" fontWeight={800} variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {label}
            </Typography>
          </Stack>

          <Stack alignItems="flex-baseline" direction="row" justifyContent="space-between" spacing={1}>
            <Typography fontWeight={900} variant="h3" sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            {subtitle && (
              <Typography color="text.secondary" fontWeight={600} variant="caption">
                {subtitle}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default memo(StatCard);


