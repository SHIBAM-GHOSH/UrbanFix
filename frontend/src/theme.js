import { createTheme } from '@mui/material/styles';

const colors = {
  brand: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    500: '#7C3AED',
    600: '#6D28D9',
    700: '#5B21B6',
  },
  blue: '#2563EB',
  cyan: '#0891B2',
  emerald: '#16A34A',
  amber: '#D97706',
  rose: '#DC2626',
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    500: '#64748B',
    700: '#334155',
    900: '#0F172A',
  },
};

const shadows = {
  card: '0 14px 34px rgba(15, 23, 42, 0.07)',
  focus: '0 0 0 3px rgba(124, 58, 237, 0.18)',
};

function createPalette(mode = 'light') {
  const isLight = mode === 'light';

  return {
    mode,
    primary: {
      main: colors.brand[600],
      dark: colors.brand[700],
      light: colors.brand[100],
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.blue,
      contrastText: '#FFFFFF',
    },
    success: { main: colors.emerald },
    warning: { main: colors.amber },
    error: { main: colors.rose },
    info: { main: colors.blue },
    background: {
      default: isLight ? colors.slate[50] : '#0B1120',
      paper: isLight ? '#FFFFFF' : '#111827',
    },
    divider: isLight ? '#E8EDF4' : 'rgba(148, 163, 184, 0.24)',
    text: {
      primary: isLight ? '#172033' : '#E5E7EB',
      secondary: isLight ? colors.slate[500] : '#94A3B8',
    },
  };
}

function createUrbanFixTheme(mode = 'light') {
  const palette = createPalette(mode);

  return createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    palette,
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    typography: {
      fontFamily: 'Inter, "Segoe UI", Roboto, Arial, sans-serif',
      h1: {
        fontSize: '2rem',
        fontWeight: 900,
        letterSpacing: 0,
        lineHeight: 1.15,
      },
      h2: {
        fontSize: '1.625rem',
        fontWeight: 850,
        letterSpacing: 0,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: '1.25rem',
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: 1.25,
      },
      h4: {
        fontSize: '1.875rem',
        fontWeight: 900,
        letterSpacing: 0,
        lineHeight: 1.2,
      },
      body1: {
        lineHeight: 1.65,
      },
      body2: {
        lineHeight: 1.55,
      },
      button: {
        fontWeight: 800,
        letterSpacing: 0,
        textTransform: 'none',
      },
      overline: {
        fontWeight: 900,
        letterSpacing: '0.08em',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
          },
          body: {
            minWidth: 320,
            textRendering: 'optimizeLegibility',
          },
          a: {
            color: 'inherit',
          },
          img: {
            maxWidth: '100%',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            minHeight: 40,
            padding: '9px 16px',
          },
          contained: {
            boxShadow: shadows.card,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${palette.divider}`,
            boxShadow: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 700,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 8,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              boxShadow: shadows.focus,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: palette.text.secondary,
            fontSize: '0.75rem',
            fontWeight: 900,
            textTransform: 'uppercase',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 6,
            fontWeight: 700,
          },
        },
      },
    },
  });
}

const theme = createUrbanFixTheme('light');

export { colors, createUrbanFixTheme };
export default theme;
