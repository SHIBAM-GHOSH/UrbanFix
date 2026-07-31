import { Card, CardContent, Grid, Skeleton, Stack } from '@mui/material';

export function CardGridSkeleton({ count = 6, height = 240 }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid key={`skel-card-${index}`} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              height: '100%',
            }}
          >
            <Skeleton height={140} variant="rectangular" sx={{ borderRadius: '12px 12px 0 0' }} />
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1.5}>
                <Skeleton height={24} width="80%" />
                <Skeleton height={18} width="95%" />
                <Skeleton height={18} width="60%" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export function TableRowsSkeleton({ columns = 6, rows = 5 }) {
  return (
    <Stack spacing={1.5} sx={{ p: 2 }}>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <Stack key={`row-skel-${rIdx}`} direction="row" spacing={2} alignItems="center">
          {Array.from({ length: columns }).map((_, cIdx) => (
            <Skeleton key={`cell-${rIdx}-${cIdx}`} height={40} sx={{ flex: 1, borderRadius: 1.5 }} />
          ))}
        </Stack>
      ))}
    </Stack>
  );
}

export function ComplaintDetailSkeleton() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack spacing={3}>
          <Skeleton height={320} variant="rounded" sx={{ borderRadius: 3 }} />
          <Skeleton height={40} width="70%" />
          <Skeleton height={20} width="100%" />
          <Skeleton height={20} width="90%" />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={2}>
          <Skeleton height={120} variant="rounded" sx={{ borderRadius: 3 }} />
          <Skeleton height={180} variant="rounded" sx={{ borderRadius: 3 }} />
        </Stack>
      </Grid>
    </Grid>
  );
}
