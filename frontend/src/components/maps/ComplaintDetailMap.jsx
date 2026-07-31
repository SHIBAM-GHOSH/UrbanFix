// Source: Google Maps Platform Code Assist
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Box, Paper, Typography } from '@mui/material';
import LocationOffOutlinedIcon from '@mui/icons-material/LocationOffOutlined';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_MAP_ID, MapFallbackNotice } from './GoogleMapsProvider';

function getStatusColor(status) {
  switch (status) {
    case 'RESOLVED':
      return { bg: '#2e7d32', border: '#1b5e20' };
    case 'IN_PROGRESS':
      return { bg: '#0288d1', border: '#01579b' };
    case 'PENDING':
    default:
      return { bg: '#ed6c02', border: '#e65100' };
  }
}

export default function ComplaintDetailMap({
  latitude,
  longitude,
  title,
  status = 'PENDING',
  height = 320,
}) {
  const isKeyAvailable = Boolean(GOOGLE_MAPS_API_KEY);

  const parsedLat = Number(latitude);
  const parsedLng = Number(longitude);
  const hasValidCoords =
    !Number.isNaN(parsedLat) &&
    !Number.isNaN(parsedLng) &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLng >= -180 &&
    parsedLng <= 180 &&
    (parsedLat !== 0 || parsedLng !== 0);

  if (!hasValidCoords) {
    return (
      <Paper
        variant="outlined"
        sx={{
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          borderRadius: 3,
          bgcolor: 'action.hover',
          p: 3,
          textAlign: 'center',
        }}
      >
        <LocationOffOutlinedIcon color="action" sx={{ fontSize: 48, mb: 1 }} />
        <Typography fontWeight={700} color="text.secondary">
          No GPS Coordinates
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Exact latitude & longitude were not provided for this complaint.
        </Typography>
      </Paper>
    );
  }

  if (!isKeyAvailable) {
    return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'background.default' }}>
        <MapFallbackNotice title="Complaint Location Map (API Key Required)" />
        <Typography variant="body2" sx={{ mt: 1.5, fontWeight: 700 }} color="text.primary">
          Coordinates: {parsedLat}, {parsedLng}
        </Typography>
      </Paper>
    );
  }

  const statusColors = getStatusColor(status);
  const position = { lat: parsedLat, lng: parsedLng };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        height,
        width: '100%',
      }}
    >
      <Map
        defaultCenter={position}
        defaultZoom={15}
        mapId={GOOGLE_MAPS_MAP_ID}
        gestureHandling="cooperative"
        disableDefaultUI={false}
        style={{ width: '100%', height: '100%' }}
      >
        <AdvancedMarker position={position} title={title || 'Complaint Location'}>
          <Pin background={statusColors.bg} glyphColor="#ffffff" borderColor={statusColors.border} />
        </AdvancedMarker>
      </Map>

      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          pointerEvents: 'none',
        }}
      >
        <Paper
          elevation={2}
          sx={{
            py: 0.5,
            px: 1.25,
            borderRadius: 1.5,
            bgcolor: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
          }}
        >
          <Typography variant="caption" fontFamily="monospace" fontWeight={600}>
            {parsedLat.toFixed(5)}, {parsedLng.toFixed(5)}
          </Typography>
        </Paper>
      </Box>
    </Paper>
  );
}
