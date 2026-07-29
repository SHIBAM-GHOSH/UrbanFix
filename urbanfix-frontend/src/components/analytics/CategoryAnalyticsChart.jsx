import { useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import EmptyState from '../shared/EmptyState';

const CATEGORY_COLORS = [
  '#7C3AED',
  '#2563EB',
  '#059669',
  '#D97706',
  '#DC2626',
  '#0891B2',
  '#8B5CF6',
  '#3B82F6',
  '#10B981',
];

function CustomCategoryTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = payload[0].payload.totalVolume || 0;
    const count = data.value || 0;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
          p: 1.5,
        }}
      >
        <Typography fontWeight={800} variant="body2">
          {data.name}
        </Typography>
        <Typography color="primary.main" fontWeight={900} variant="body1" sx={{ my: 0.25 }}>
          {count.toLocaleString()} complaints
        </Typography>
        <Typography color="text.secondary" variant="caption">
          {percentage}% of total complaints
        </Typography>
      </Box>
    );
  }
  return null;
}

function CategoryAnalyticsChart({ data = [] }) {
  const totalVolume = useMemo(() => {
    return data.reduce((acc, curr) => acc + (curr.complaintCount || 0), 0);
  }, [data]);

  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      totalVolume,
    }));
  }, [data, totalVolume]);

  if (!data || data.length === 0) {
    return <EmptyState description="No department category telemetry available." title="No Category Data" />;
  }

  return (
    <Box sx={{ height: { xs: 280, sm: 340 }, width: '100%', position: 'relative' }}>
      <ResponsiveContainer height="100%" width="100%">
        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Pie
            data={chartData}
            dataKey="complaintCount"
            innerRadius="58%"
            nameKey="category"
            outerRadius="88%"
            paddingAngle={3}
          >
            {chartData.map((entry, index) => (
              <Cell fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} key={entry.category} />
            ))}
          </Pie>
          <Tooltip content={<CustomCategoryTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span style={{ color: '#334155', fontWeight: 600, fontSize: '0.8125rem' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Donut Label */}
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          textAlign: 'center',
        }}
      >
        <Typography color="text.secondary" fontWeight={700} variant="caption">
          TOTAL
        </Typography>
        <Typography fontWeight={900} variant="h5">
          {totalVolume.toLocaleString()}
        </Typography>
      </Stack>
    </Box>
  );
}

export default CategoryAnalyticsChart;

