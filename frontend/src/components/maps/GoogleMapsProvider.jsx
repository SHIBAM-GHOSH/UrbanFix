import { APIProvider } from '@vis.gl/react-google-maps';
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
export const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

export function MapFallbackNotice({ title = 'Google Maps API Key Not Configured' }) {
  return (
    <Alert
      severity="info"
      icon={<MapOutlinedIcon fontSize="large" />}
      sx={{
        borderRadius: 3,
        border: '1px dashed',
        borderColor: 'info.main',
        py: 2,
        alignItems: 'center',
      }}
    >
      <AlertTitle sx={{ fontWeight: 800 }}>{title}</AlertTitle>
      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1.5 }}>
        To view live Google Maps, interactive pin dragging, and automatic address geocoding, please add your Google Maps API key to the <code>frontend/.env</code> file.
      </Typography>
      <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 1.5, fontFamily: 'monospace', fontSize: '0.825rem' }}>
        VITE_GOOGLE_MAPS_API_KEY=your_key_here
      </Box>
      <Typography variant="caption" color="text.secondary" display="block">
        Get a free key with $200 monthly credit from{' '}
        <Button
          component="a"
          href="https://mapsplatform.google.com/maps-demo-key"
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          sx={{ p: 0, minWidth: 0, textTransform: 'none', textDecoration: 'underline' }}
        >
          Google Maps Demo Key Quickstart
        </Button>
      </Typography>
    </Alert>
  );
}

export default function GoogleMapsProvider({ children }) {
  if (!GOOGLE_MAPS_API_KEY) {
    return children;
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} internalUsageAttributionIds={['gmp_git_agentskills_v1']}>
      {children}
    </APIProvider>
  );
}
