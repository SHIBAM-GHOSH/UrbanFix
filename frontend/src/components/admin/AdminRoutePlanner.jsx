// Source: Google Maps Platform Code Assist
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';
import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_MAP_ID, MapFallbackNotice } from '../maps/GoogleMapsProvider';
import ComplaintStatusChip from '../complaints/ComplaintStatusChip';

// Municipal HQ Default Origin (City Center)
const DEFAULT_HQ_ORIGIN = { lat: 28.6139, lng: 77.2090, label: 'Municipal HQ (City Center)' };

const CATEGORIES = [
  'All Categories',
  'Roads & Traffic',
  'Sanitation & Waste',
  'Water Supply',
  'Electrical & Lighting',
  'Public Parks',
  'Noise & Pollution',
  'Other',
];

// Calculate Haversine distance in kilometers between two lat/lng points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Nearest Neighbor Traveling Salesperson (TSP) algorithm to order stops
function optimizeRoute(origin, complaints) {
  if (!complaints || complaints.length === 0) return { orderedStops: [], totalDistance: 0, estimatedMins: 0 };

  const unvisited = [...complaints];
  const orderedStops = [];
  let currentPos = { lat: origin.lat, lng: origin.lng };
  let totalDistance = 0;

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistance(
        currentPos.lat,
        currentPos.lng,
        Number(unvisited[i].latitude),
        Number(unvisited[i].longitude)
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIndex = i;
      }
    }

    const nextStop = unvisited.splice(nearestIndex, 1)[0];
    totalDistance += nearestDist;
    currentPos = { lat: Number(nextStop.latitude), lng: Number(nextStop.longitude) };
    orderedStops.push({
      ...nextStop,
      stopNumber: orderedStops.length + 1,
      distanceFromPrevKm: Number(nearestDist.toFixed(2)),
    });
  }

  // Estimated driving time (30 km/h city avg speed) + 12 mins per inspection stop
  const drivingMins = Math.round((totalDistance / 30) * 60);
  const inspectionMins = orderedStops.length * 12;
  const estimatedMins = drivingMins + inspectionMins;

  return {
    orderedStops,
    totalDistance: Number(totalDistance.toFixed(2)),
    estimatedMins,
  };
}

// Component to dynamically draw connecting Polyline on Google Maps
function RoutePolylineOverlay({ path }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !path || path.length < 2 || !window.google) return;

    const line = new window.google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#2563EB',
      strokeOpacity: 0.8,
      strokeWeight: 4,
    });

    line.setMap(map);

    return () => {
      line.setMap(null);
    };
  }, [map, path]);

  return null;
}

export default function AdminRoutePlanner({ complaints = [], onStatusUpdate }) {
  const isKeyAvailable = Boolean(GOOGLE_MAPS_API_KEY);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('ALL_ACTIVE');
  const [originType, setOriginType] = useState('HQ');
  const [gpsOrigin, setGpsOrigin] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);

  // Determine current origin (HQ or User GPS)
  const currentOrigin = useMemo(() => {
    if (originType === 'GPS' && gpsOrigin) return gpsOrigin;
    return DEFAULT_HQ_ORIGIN;
  }, [originType, gpsOrigin]);

  // Filter complaints based on user selections
  const filteredComplaints = useMemo(() => {
    return (complaints || []).filter((item) => {
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);
      const hasValidCoords =
        !Number.isNaN(lat) &&
        !Number.isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180 &&
        (lat !== 0 || lng !== 0);

      if (!hasValidCoords) return false;

      // Status Filter
      if (selectedStatus === 'PENDING' && item.status !== 'PENDING') return false;
      if (selectedStatus === 'IN_PROGRESS' && item.status !== 'IN_PROGRESS') return false;
      if (selectedStatus === 'ALL_ACTIVE' && item.status === 'RESOLVED') return false;

      // Category Filter
      if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) return false;

      return true;
    });
  }, [complaints, selectedCategory, selectedStatus]);

  // Compute optimized TSP route
  const routeData = useMemo(() => {
    return optimizeRoute(currentOrigin, filteredComplaints);
  }, [currentOrigin, filteredComplaints]);

  // Polyline path array connecting origin to all stops in sequence
  const polylinePath = useMemo(() => {
    if (routeData.orderedStops.length === 0) return [];
    return [
      { lat: currentOrigin.lat, lng: currentOrigin.lng },
      ...routeData.orderedStops.map((s) => ({ lat: Number(s.latitude), lng: Number(s.longitude) })),
    ];
  }, [currentOrigin, routeData.orderedStops]);

  // Acquire Inspector GPS location
  const handleAcquireGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        setGpsOrigin({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
          label: 'Inspector GPS Location',
        });
        setOriginType('GPS');
      },
      (err) => {
        setGpsLoading(false);
        console.warn('Geolocation error:', err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={3}>
        {/* Header Title & Department Controls */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <RouteRoundedIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h3" fontWeight={800}>
                Field Inspection Route Planner
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Calculate the optimal inspection path for field crews based on team specialization and priority.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} width={{ xs: '100%', md: 'auto' }}>
            <Button
              variant={originType === 'HQ' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<LocationOnRoundedIcon />}
              onClick={() => setOriginType('HQ')}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Start from HQ
            </Button>
            <Button
              variant={originType === 'GPS' ? 'contained' : 'outlined'}
              size="small"
              startIcon={gpsLoading ? <CircularProgress size={14} color="inherit" /> : <MyLocationRoundedIcon />}
              onClick={handleAcquireGPS}
              disabled={gpsLoading}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Start from My GPS
            </Button>
          </Stack>
        </Stack>

        {/* Filter Controls Row */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Team / Category Specialization"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat === 'All Categories' ? '🔧 All Municipal Teams' : `🔧 ${cat}`}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Complaint Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <MenuItem value="ALL_ACTIVE">All Active Issues (Pending & In Progress)</MenuItem>
              <MenuItem value="PENDING">Pending Triage Only</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress Work Orders Only</MenuItem>
            </TextField>
          </Grid>

          {/* Route Summary KPI Badges */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={1.5} height="100%" alignItems="center">
              <Chip
                icon={<FlagRoundedIcon />}
                label={`${routeData.orderedStops.length} Stops`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700, py: 2 }}
              />
              <Chip
                icon={<DirectionsCarRoundedIcon />}
                label={`${routeData.totalDistance} km`}
                color="secondary"
                variant="outlined"
                sx={{ fontWeight: 700, py: 2 }}
              />
              <Chip
                icon={<AccessTimeRoundedIcon />}
                label={`~${routeData.estimatedMins} mins`}
                color="success"
                variant="outlined"
                sx={{ fontWeight: 700, py: 2 }}
              />
            </Stack>
          </Grid>
        </Grid>

        {/* Main Route View & Sidebar */}
        <Grid container spacing={2.5}>
          {/* Interactive Map View */}
          <Grid size={{ xs: 12, lg: 7 }}>
            {!isKeyAvailable ? (
              <MapFallbackNotice title="Interactive Route Map (API Key Required)" />
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  height: { xs: 380, md: 520 },
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  width: '100%',
                }}
              >
                <Map
                  defaultCenter={{ lat: currentOrigin.lat, lng: currentOrigin.lng }}
                  defaultZoom={13}
                  mapId={GOOGLE_MAPS_MAP_ID}
                  gestureHandling="greedy"
                  style={{ width: '100%', height: '100%' }}
                >
                  <RoutePolylineOverlay path={polylinePath} />

                  {/* Origin Marker */}
                  <AdvancedMarker position={{ lat: currentOrigin.lat, lng: currentOrigin.lng }} title={currentOrigin.label}>
                    <Pin background="#1e293b" glyphColor="#ffffff" borderColor="#0f172a" />
                  </AdvancedMarker>

                  {/* Waypoint Markers */}
                  {routeData.orderedStops.map((stop) => (
                    <AdvancedMarker
                      key={stop.id}
                      position={{ lat: Number(stop.latitude), lng: Number(stop.longitude) }}
                      onClick={() => setSelectedStop(stop)}
                      title={`Stop #${stop.stopNumber}: ${stop.title}`}
                    >
                      <Box
                        sx={{
                          bgcolor: stop.status === 'IN_PROGRESS' ? '#0288d1' : '#ed6c02',
                          color: '#fff',
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          border: '2.5px solid #ffffff',
                          boxShadow: '0px 3px 6px rgba(0,0,0,0.3)',
                          cursor: 'pointer',
                        }}
                      >
                        {stop.stopNumber}
                      </Box>
                    </AdvancedMarker>
                  ))}

                  {/* Selected Stop InfoWindow */}
                  {selectedStop && (
                    <InfoWindow
                      position={{ lat: Number(selectedStop.latitude), lng: Number(selectedStop.longitude) }}
                      onCloseClick={() => setSelectedStop(null)}
                    >
                      <Box sx={{ p: 1, maxWidth: 260 }}>
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Chip label={`Stop #${selectedStop.stopNumber}`} color="primary" size="small" sx={{ fontWeight: 800 }} />
                            <ComplaintStatusChip status={selectedStop.status} size="small" />
                          </Stack>
                          <Typography fontWeight={800} variant="subtitle2">
                            {selectedStop.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            📍 {selectedStop.location}
                          </Typography>
                          {onStatusUpdate && (
                            <Button
                              size="small"
                              variant="contained"
                              color="secondary"
                              onClick={() => {
                                onStatusUpdate(
                                  selectedStop.id,
                                  selectedStop.status === 'PENDING' ? 'IN_PROGRESS' : 'RESOLVED'
                                );
                                setSelectedStop(null);
                              }}
                              sx={{ textTransform: 'none', fontWeight: 700 }}
                            >
                              {selectedStop.status === 'PENDING' ? 'Mark In Progress' : 'Mark Resolved'}
                            </Button>
                          )}
                        </Stack>
                      </Box>
                    </InfoWindow>
                  )}
                </Map>

                {/* Floating Origin Banner */}
                <Box sx={{ position: 'absolute', top: 12, left: 12, pointerEvents: 'none' }}>
                  <Paper
                    elevation={3}
                    sx={{
                      py: 0.5,
                      px: 1.25,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.94)',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <NavigationRoundedIcon color="primary" fontSize="small" />
                    <Typography variant="caption" fontWeight={800}>
                      Start: {currentOrigin.label}
                    </Typography>
                  </Paper>
                </Box>
              </Paper>
            )}
          </Grid>

          {/* Sequential Waypoint Itinerary List */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 3,
                height: { xs: 'auto', lg: 520 },
                overflowY: 'auto',
                bgcolor: 'background.default',
              }}
            >
              <Typography fontWeight={800} variant="h3" sx={{ fontSize: '1.1rem', mb: 2 }}>
                Field Inspection Itinerary
              </Typography>

              {routeData.orderedStops.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  No active complaints found for the selected team category.
                </Alert>
              ) : (
                <Stack spacing={1.75} divider={<Divider flexItem />}>
                  {routeData.orderedStops.map((stop) => (
                    <Box key={stop.id} sx={{ cursor: 'pointer' }} onClick={() => setSelectedStop(stop)}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Box
                          sx={{
                            bgcolor: 'primary.main',
                            color: '#fff',
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '0.8rem',
                            flexShrink: 0,
                            mt: 0.25,
                          }}
                        >
                          {stop.stopNumber}
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 0.5 }}>
                            <Typography fontWeight={800} variant="body2">
                              {stop.title}
                            </Typography>
                            <ComplaintStatusChip status={stop.status} size="small" />
                          </Stack>

                          <Typography variant="caption" color="text.secondary" display="block">
                            📍 {stop.location}
                          </Typography>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                            <Chip label={stop.category} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                            <Typography variant="caption" color="primary" fontWeight={700}>
                              +{stop.distanceFromPrevKm} km from prev stop
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
}
