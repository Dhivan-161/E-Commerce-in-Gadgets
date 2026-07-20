import { createTheme } from '@mui/material/styles';

// ─────────────────────────────────────────────
// 1% Battery Design Tokens
// Primary  : Electric Blue  #2563EB
// Secondary: Cyan           #06B6D4
// Accent   : Orange         #F97316  (CTA)
// Success  : Green          #22C55E
// Error    : Red            #EF4444
// ─────────────────────────────────────────────

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563EB',
        light: '#60A5FA',
        dark: '#1D4ED8',
        contrastText: '#fff',
      },
      secondary: {
        main: '#06B6D4',
        light: '#67E8F9',
        dark: '#0891B2',
        contrastText: '#fff',
      },
      // Orange is surfaced via the 'warning' slot so MUI Buttons can use it
      warning: {
        main: '#F97316',
        light: '#FB923C',
        dark: '#EA580C',
        contrastText: '#fff',
      },
      background: {
        default: mode === 'dark' ? '#0F172A' : '#F8FAFC',
        paper:   mode === 'dark' ? '#1E293B' : '#FFFFFF',
      },
      text: {
        primary:   mode === 'dark' ? '#F1F5F9' : '#0F172A',
        secondary: mode === 'dark' ? '#94A3B8' : '#475569',
      },
      success: { main: '#22C55E', contrastText: '#fff' },
      error:   { main: '#EF4444', contrastText: '#fff' },
      divider: mode === 'dark' ? '#1E293B' : '#E2E8F0',
    },

    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      h1: { fontWeight: 800, letterSpacing: '-0.03em' },
      h2: { fontWeight: 700, letterSpacing: '-0.025em' },
      h3: { fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    },

    shape: { borderRadius: 16 },

    shadows: [
      'none',
      '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
      '0 4px 6px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.05)',
      '0 10px 15px rgba(15,23,42,0.08), 0 4px 6px rgba(15,23,42,0.05)',
      '0 20px 25px rgba(15,23,42,0.10), 0 10px 10px rgba(15,23,42,0.06)',
      '0 25px 50px rgba(15,23,42,0.12)',
      ...Array(19).fill('none'),
    ],

    components: {
      // ── AppBar ──────────────────────────────────
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'dark'
              ? 'rgba(15,23,42,0.80)'
              : 'rgba(248,250,252,0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: 'none',
          },
        },
      },

      // ── Buttons ─────────────────────────────────
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 24px',
            boxShadow: 'none',
            transition: 'all 0.2s ease',
            '&:hover': { boxShadow: '0 4px 20px rgba(37,99,235,0.25)', transform: 'translateY(-1px)' },
            '&:active': { transform: 'translateY(0)' },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1D4ED8 0%, #0891B2 100%)',
              boxShadow: '0 6px 24px rgba(37,99,235,0.35)',
            },
          },
          containedWarning: {
            background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
              boxShadow: '0 6px 24px rgba(249,115,22,0.35)',
            },
          },
          outlinedPrimary: {
            borderWidth: '1.5px',
            '&:hover': { borderWidth: '1.5px', background: 'rgba(37,99,235,0.06)' },
          },
        },
      },

      // ── Cards ────────────────────────────────────
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            background: mode === 'dark' ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${mode === 'dark' ? '#334155' : '#E2E8F0'}`,
            boxShadow: mode === 'dark'
              ? '0 4px 24px rgba(0,0,0,0.3)'
              : '0 4px 24px rgba(15,23,42,0.06)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: mode === 'dark'
                ? '0 20px 40px rgba(0,0,0,0.45)'
                : '0 20px 40px rgba(37,99,235,0.12)',
            },
          },
        },
      },

      // ── Paper ────────────────────────────────────
      MuiPaper: {
        styleOverrides: {
          root: {
            background: mode === 'dark' ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${mode === 'dark' ? '#334155' : '#E2E8F0'}`,
            borderRadius: 16,
          },
        },
      },

      // ── Inputs ───────────────────────────────────
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              background: mode === 'dark' ? 'rgba(30,41,59,0.6)' : '#F8FAFC',
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2563EB' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2563EB',
                borderWidth: '2px',
              },
            },
          },
        },
      },

      // ── Chip ─────────────────────────────────────
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: 8 },
        },
      },

      // ── Drawer ───────────────────────────────────
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: mode === 'dark' ? '#0F172A' : '#FFFFFF',
            border: 'none',
          },
        },
      },

      // ── Divider ──────────────────────────────────
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: mode === 'dark' ? '#334155' : '#E2E8F0' },
        },
      },

      // ── Badge ────────────────────────────────────
      MuiBadge: {
        styleOverrides: {
          badge: {
            background: '#F97316',
            color: '#fff',
            fontWeight: 700,
          },
        },
      },

      // ── Rating ───────────────────────────────────
      MuiRating: {
        styleOverrides: {
          iconFilled: { color: '#F97316' },
          iconHover:  { color: '#EA580C' },
        },
      },
    },
  });
