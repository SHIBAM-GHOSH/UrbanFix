import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6D28D9',
      dark: '#5B21B6',
      light: '#EDE9FE',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2563EB',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#172033',
      secondary: '#64748B',
    },
    success: { main: '#16A34A' },
    warning: { main: '#D97706' },
    error: { main: '#DC2626' },
    info: { main: '#2563EB' },
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", Roboto, Arial, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em' },
    h2: { fontSize: '1.5rem', fontWeight: 750, letterSpacing: '-0.03em' },
    h3: { fontSize: '1.25rem', fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, padding: '9px 16px' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { border: '1px solid #E8EDF4', boxShadow: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

export default theme;
