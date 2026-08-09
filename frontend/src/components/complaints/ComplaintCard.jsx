import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ComplaintStatusChip from './ComplaintStatusChip';
import SeverityChip from './SeverityChip';

import { getImageUrl } from '../../utils/imageUtils';

function ComplaintCard({ complaint }) {
  const createdAt = new Date(complaint.createdAt).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card sx={{ height: '100%', transition: 'transform 180ms ease, box-shadow 180ms ease', '&:hover': { boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)', transform: 'translateY(-2px)' } }}>
      <CardActionArea component={RouterLink} sx={{ alignItems: 'stretch', display: 'flex', flexDirection: 'column', height: '100%' }} to={`/complaints/${complaint.id}`}>
        {complaint.imageUrl && (
          <CardMedia alt={complaint.title} component="img" height="180" image={getImageUrl(complaint.imageUrl)} />
        )}
        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1.5, p: 2.5 }}>
          <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={1}>
            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
              <Chip color="primary" label={complaint.category} size="small" variant="outlined" />
              <SeverityChip severity={complaint.severity} />
            </Stack>
            <ComplaintStatusChip status={complaint.status} />
          </Stack>
          <Box>
            <Typography component="h2" gutterBottom noWrap variant="h3">
              {complaint.title}
            </Typography>
            <Typography color="text.secondary" sx={{ display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }} variant="body2">
              {complaint.description}
            </Typography>
          </Box>
          <Stack color="text.secondary" spacing={0.75} sx={{ mt: 'auto' }}>
            <Stack alignItems="center" direction="row" spacing={0.75}>
              <LocationOnOutlinedIcon fontSize="small" />
              <Typography noWrap variant="caption">{complaint.location}</Typography>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={0.75}>
              <CalendarMonthOutlinedIcon fontSize="small" />
              <Typography variant="caption">Reported {createdAt}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ComplaintCard;
