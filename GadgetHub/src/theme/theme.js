import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#6C63FF',
        light: '#9C95FF',
        dark: '#4B44CC',
        contrastText: '#fff',
      },
      secondary: {
        main: '#FF6584',
        light: '#FF8FA3',
        dark: '#CC4166',
        contrastText: '#fff',
      },
      background: {
        default: mode === 'dark' ? '#0A0A0F' : '#F8F9FF',
        paper: mode === 'dark' ? '#12121A' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#E8E8F0' : '#1A1A2E',
        secondary: mode === 'dark' ? '#9999BB' : '#6B6B8D',
      },
      success: { main: '#4CAF50' },
      warning: { main: '#FF9800' },
      error: { main: '#F44336' },
      divider: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    },
    typography: {
      fontFamily: "'Inter', system-ui, sans-serif",
      h1: { fontWeight: 800, letterSpacing: '-0.03em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0' },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 24px',
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 20px rgba(108,99,255,0.3)' },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #6C63FF 0%, #9C95FF 100%)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'dark'
              ? '0 4px 24px rgba(0,0,0,0.4)'
              : '0 4px 24px rgba(0,0,0,0.06)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: mode === 'dark'
                ? '0 12px 40px rgba(0,0,0,0.5)'
                : '0 12px 40px rgba(0,0,0,0.12)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600 } },
      },
      MuiTextField: {
        styleOverrides: {
          root: { '& .MuiOutlinedInput-root': { borderRadius: 10 } },
        },
      },
    },
  });
