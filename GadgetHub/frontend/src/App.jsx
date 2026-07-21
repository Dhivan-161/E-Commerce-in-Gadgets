import React, { useMemo } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box } from '@mui/material';

import { ThemeContextProvider, useThemeMode } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { getTheme } from './theme/theme';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';

// Wrapper that hides Navbar/Footer on admin routes
const AppShell = ({ mode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      background: mode === 'dark'
        ? 'linear-gradient(-45deg, #0F172A, #1E293B, #0F1E3C, #0F172A)'
        : 'linear-gradient(-45deg, #F8FAFC, #EFF6FF, #F0FDFF, #F8FAFC)',
      backgroundSize: '400% 400%',
      animation: 'gradientBG 15s ease infinite',
      '@keyframes gradientBG': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
      }
    }}>
      {!isAdminRoute && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <AppRoutes />
      </Box>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <AIChatbot />}
    </Box>
  );
};

// Inner app: consumes theme context to build MUI theme
const ThemedApp = () => {
  const { mode } = useThemeMode();
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppShell mode={mode} />
      </Router>
    </ThemeProvider>
  );
};

// Root App: wraps everything with providers
const App = () => (
  <ThemeContextProvider>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <ThemedApp />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </ThemeContextProvider>
);

export default App;
