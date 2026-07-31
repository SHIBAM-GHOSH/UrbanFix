// Source: Google Maps Platform Code Assist
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ComplaintStatusChip from '../complaints/ComplaintStatusChip';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_MAP_ID, MapFallbackNotice } from './GoogleMapsProvider';

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };

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

export default function ComplaintOverviewMap({
  complaints = [],
  height = 480,
  emptyMessage = 'No complaints with valid GPS location available to display on the map.',
}) {
  const navigate = useNavigate();
  const isKeyAvailable = Boolean(GOOGLE_MAPS_API_KEY);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Filter complaints that have valid coordinates
  const validComplaints = useMemo(() => {
    return (complaints || []).filter((item) => {
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);
      return (
        !Number.isNaN(lat) &&
        !Number.isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180 &&
        (lat !== 0 || lng !== 0)
      );
    });
  }, [complaints]);

  // Compute average center or default
  const mapCenter = useMemo(() => {
    if (validComplaints.length === 0) return DEFAULT_CENTER;
    const sum = validComplaints.reduce(
      (acc, c) => ({
        lat: acc.lat + Number(c.latitude),
        lng: acc.lng + Number(c.longitude),
      }),
      { lat: 0, lng: 0 }
    );
    return {
      lat: sum.lat / validComplaints.length,
      lng: sum.lng / validComplaints.length,
    };
  }, [validComplaints]);

  if (!isKeyAvailable) {
    return (
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: 'background.default' }}>
        <MapFallbackNotice title="Overview Map (API Key Required)" />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 600 }}>
          {validComplaints.length} complaint(s) with GPS coordinates ready for map display once key is added.
        </Typography>
      </Paper>
    );
  }

  if (validComplaints.length === 0) {
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
        <LocationOnOutlinedIcon color="action" sx={{ fontSize: 48, mb: 1 }} />
        <Typography fontWeight={700} color="text.secondary">
          No Mapped Complaints
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Paper>
    );
  }

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
        defaultCenter={mapCenter}
        defaultZoom={12}
        mapId={GOOGLE_MAPS_MAP_ID}
        gestureHandling="greedy"
        disableDefaultUI={false}
        style={{ width: '100%', height: '100%' }}
      >
        {validComplaints.map((item) => {
          const lat = Number(item.latitude);
          const lng = Number(item.longitude);
          const colors = getStatusColor(item.status);

          return (
            <AdvancedMarker
              key={item.id}
              position={{ lat, lng }}
              onClick={() => setSelectedComplaint(item)}
              title={item.title}
            >
              <Pin background={colors.bg} glyphColor="#ffffff" borderColor={colors.border} />
            </AdvancedMarker>
          );
        })}

        {selectedComplaint && (
          <InfoWindow
            position={{
              lat: Number(selectedComplaint.latitude),
              lng: Number(selectedComplaint.longitude),
            }}
            onCloseClick={() => setSelectedComplaint(null)}
          >
            <Box sx={{ p: 1, maxWidth: 280 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
                  <ComplaintStatusChip status={selectedComplaint.status} size="small" />
                  <Chip label={selectedComplaint.category || 'General'} size="small" variant="outlined" />
                </Stack>
                <Typography fontWeight={800} variant="subtitle2">
                  {selectedComplaint.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  📍 {selectedComplaint.location}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  endIcon={<OpenInNewRoundedIcon fontSize="small" />}
                  onClick={() => navigate(`/complaints/${selectedComplaint.id}`)}
                  sx={{ textTransform: 'none', fontWeight: 700, mt: 0.5 }}
                >
                  View Details
                </Button>
              </Stack>
            </Box>
          </InfoWindow>
        )}
      </Map>

      {/* Floating map legend */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          pointerEvents: 'none',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            py: 0.75,
            px: 1.5,
            borderRadius: 2,
            pointerEvents: 'auto',
            bgcolor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ed6c02' }} />
            <Typography variant="caption" fontWeight={700}>Pending</Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#0288d1' }} />
            <Typography variant="caption" fontWeight={700}>In Progress</Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#2e7d32' }} />
            <Typography variant="caption" fontWeight={700}>Resolved</Typography>
          </Stack>
        </Paper>
      </Box>
    </Paper>
  );
}
