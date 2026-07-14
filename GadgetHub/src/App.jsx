import React, { useMemo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box } from '@mui/material';

import { ThemeContextProvider, useThemeMode } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { getTheme } from './theme/theme';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Inner app: consumes theme context to build MUI theme
const ThemedApp = () => {
  const { mode } = useThemeMode();
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <AppRoutes />
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

// Root App: wraps everything with providers
const App = () => (
  <ThemeContextProvider>
    <AuthProvider>
      <CartProvider>
        <ThemedApp />
      </CartProvider>
    </AuthProvider>
  </ThemeContextProvider>
);

export default App;
