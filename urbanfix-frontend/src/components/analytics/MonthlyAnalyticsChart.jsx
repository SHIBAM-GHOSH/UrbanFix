import { Box, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function MonthlyAnalyticsChart({ data }) {
  const chartData = data.map((item) => ({
    complaints: item.complaintCount,
    month: new Date(item.year, item.month - 1).toLocaleString(undefined, { month: 'short', year: '2-digit' }),
  }));

  if (!chartData.length) {
    return <Typography color="text.secondary">No monthly trend data is available yet.</Typography>;
  }

  return (
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={chartData} margin={{ left: -18, right: 12, top: 8 }}>
          <CartesianGrid stroke="#E8EDF4" strokeDasharray="3 3" vertical={false} />
          <XAxis axisLine={false} dataKey="month" tickLine={false} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: '#F5F3FF' }} />
          <Bar dataKey="complaints" fill="#6D28D9" name="Complaints" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default MonthlyAnalyticsChart;
