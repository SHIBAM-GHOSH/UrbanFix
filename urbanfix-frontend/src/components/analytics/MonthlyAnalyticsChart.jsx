import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import EmptyState from '../shared/EmptyState';

function CustomMonthlyTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const value = payload[0].value || 0;
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
        <Typography color="text.secondary" fontWeight={700} variant="caption">
          {label}
        </Typography>
        <Typography color="primary.main" fontWeight={900} variant="h6">
          {value.toLocaleString()} complaints
        </Typography>
      </Box>
    );
  }
  return null;
}

function MonthlyAnalyticsChart({ data = [] }) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      complaints: item.complaintCount,
      month: new Date(item.year, item.month - 1).toLocaleString(undefined, {
        month: 'short',
        year: '2-digit',
      }),
    }));
  }, [data]);

  if (!data || data.length === 0) {
    return <EmptyState description="No monthly reporting trends logged yet." title="No Monthly Data" />;
  }

  return (
    <Box sx={{ height: { xs: 280, sm: 340 }, width: '100%' }}>
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="month"
            tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }}
            tickLine={false}
          />
          <Tooltip content={<CustomMonthlyTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.06)' }} />
          <Bar
            dataKey="complaints"
            fill="#7C3AED"
            name="Complaints"
            radius={[8, 8, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default MonthlyAnalyticsChart;

