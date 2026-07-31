// Source: Google Maps Platform Code Assist
import { useCallback, useEffect, useState } from 'react';
import { Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Box, Button, Paper, Stack, Typography, CircularProgress } from '@mui/material';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_MAP_ID, MapFallbackNotice } from './GoogleMapsProvider';

// Default center (New Delhi / India civic center default or fallback)
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (map && center && typeof center.lat === 'number' && typeof center.lng === 'number') {
      map.panTo(center);
    }
  }, [map, center]);
  return null;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onLocationSelect,
  height = 340,
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

  const initialCenter = hasValidCoords ? { lat: parsedLat, lng: parsedLng } : DEFAULT_CENTER;

  const [markerPos, setMarkerPos] = useState(initialCenter);
  const [geoLoading, setGeoLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    if (hasValidCoords) {
      setMarkerPos({ lat: parsedLat, lng: parsedLng });
    }
  }, [parsedLat, parsedLng, hasValidCoords]);

  // Reverse Geocoding helper function
  const reverseGeocode = useCallback(async (lat, lng) => {
    if (!isKeyAvailable) return;
    setAddressLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        if (onLocationSelect) {
          onLocationSelect({
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lng.toFixed(6)),
            address: formattedAddress,
          });
        }
      } else if (onLocationSelect) {
        onLocationSelect({
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
        });
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
      if (onLocationSelect) {
        onLocationSelect({
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
        });
      }
    } finally {
      setAddressLoading(false);
    }
  }, [isKeyAvailable, onLocationSelect]);

  const handleMapClick = useCallback((e) => {
    if (!e.detail.latLng) return;
    const newLat = Number(e.detail.latLng.lat.toFixed(6));
    const newLng = Number(e.detail.latLng.lng.toFixed(6));
    setMarkerPos({ lat: newLat, lng: newLng });
    reverseGeocode(newLat, newLng);
  }, [reverseGeocode]);

  const handleMarkerDragEnd = useCallback((e) => {
    if (!e.latLng) return;
    const newLat = Number(e.latLng.lat().toFixed(6));
    const newLng = Number(e.latLng.lng().toFixed(6));
    setMarkerPos({ lat: newLat, lng: newLng });
    reverseGeocode(newLat, newLng);
  }, [reverseGeocode]);

  const handleUseCurrentGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        const newLat = Number(position.coords.latitude.toFixed(6));
        const newLng = Number(position.coords.longitude.toFixed(6));
        setMarkerPos({ lat: newLat, lng: newLng });
        reverseGeocode(newLat, newLng);
      },
      (error) => {
        setGeoLoading(false);
        console.warn('Geolocation error:', error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [reverseGeocode]);

  if (!isKeyAvailable) {
    return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'background.default' }}>
        <MapFallbackNotice title="Interactive GPS Map (API Key Required)" />
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
        height: height,
        width: '100%',
      }}
    >
      <Map
        defaultCenter={initialCenter}
        defaultZoom={15}
        mapId={GOOGLE_MAPS_MAP_ID}
        onClick={handleMapClick}
        gestureHandling="greedy"
        disableDefaultUI={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MapController center={markerPos} />
        <AdvancedMarker
          position={markerPos}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
          title="Drag pin or click map to pick complaint location"
        >
          <Pin background="#e53935" glyphColor="#ffffff" borderColor="#b71c1c" />
        </AdvancedMarker>
      </Map>

      {/* Floating map controls header */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: 12,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
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
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <MapOutlinedIcon color="primary" fontSize="small" />
          <Typography variant="caption" fontWeight={700} color="text.primary">
            {addressLoading ? 'Fetching address...' : 'Click map or drag pin to select spot'}
          </Typography>
          {addressLoading && <CircularProgress size={14} />}
        </Paper>

        <Button
          variant="contained"
          size="small"
          startIcon={geoLoading ? <CircularProgress size={14} color="inherit" /> : <MyLocationRoundedIcon />}
          onClick={handleUseCurrentGPS}
          disabled={geoLoading}
          sx={{
            pointerEvents: 'auto',
            borderRadius: 2,
            boxShadow: 3,
            fontWeight: 700,
            textTransform: 'none',
          }}
        >
          {geoLoading ? 'Locating...' : 'My GPS'}
        </Button>
      </Box>

      {/* Floating coordinates indicator */}
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
            {markerPos.lat.toFixed(5)}, {markerPos.lng.toFixed(5)}
          </Typography>
        </Paper>
      </Box>
    </Paper>
  );
}
