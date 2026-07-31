import { Paper } from '@mui/material';

function SectionCard({ children, component = 'section', sx, ...props }) {
  return (
    <Paper
      component={component}
      {...props}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: { xs: 2.5, md: 3 },
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

export default SectionCard;
