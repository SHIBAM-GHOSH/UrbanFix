import { Box, Typography } from '@mui/material';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const colors = ['#6D28D9', '#2563EB', '#D97706', '#16A34A', '#DB2777', '#0891B2'];

function CategoryAnalyticsChart({ data }) {
  if (!data.length) {
    return <Typography color="text.secondary">No category data is available yet.</Typography>;
  }

  return (
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Pie data={data} dataKey="complaintCount" innerRadius={58} nameKey="category" outerRadius={95} paddingAngle={3}>
            {data.map((entry, index) => <Cell fill={colors[index % colors.length]} key={entry.category} />)}
          </Pie>
          <Tooltip formatter={(value) => [value, 'Complaints']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default CategoryAnalyticsChart;
