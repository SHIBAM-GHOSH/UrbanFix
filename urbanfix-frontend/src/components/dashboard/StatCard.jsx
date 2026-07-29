import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

function StatCard({ color, icon, label, value }) {
  return (
    <Card>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: `${color}18`,
              borderRadius: 2,
              color,
              display: 'flex',
              height: 46,
              justifyContent: 'center',
              width: 46,
            }}
          >
            {icon}
          </Box>
          <Box textAlign="right">
            <Typography color="text.secondary" variant="body2">
              {label}
            </Typography>
            <Typography fontWeight={800} variant="h3">
              {value.toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default StatCard;
