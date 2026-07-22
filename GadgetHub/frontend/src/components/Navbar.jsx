import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Badge, Box,
  InputBase, Drawer, List, ListItem, ListItemText, Divider,
  useScrollTrigger, Slide, Tooltip, Button, Avatar,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useThemeMode } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getHealth } from '../services/api';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Deals', path: '/deals' },
  { label: 'Student Deals', path: '/student-deals' },
  { label: 'About', path: '/about' },
];

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return <Slide appear={false} direction="down" in={!trigger}>{children}</Slide>;
}

const Navbar = ({ onSearch }) => {
  const { cartCount } = useCart();
  const { mode, toggleTheme } = useThemeMode();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbConnected, setDbConnected] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkDb = async () => {
      try {
        const health = await getHealth();
        if (isMounted) {
          if (health && health.database === 'Connected') {
            setDbConnected(true);
          } else {
            setDbConnected(false);
          }
        }
      } catch (err) {
        if (isMounted) setDbConnected(false);
      }
    };
    checkDb();
    const interval = setInterval(checkDb, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      if (onSearch) onSearch(searchQuery.trim());
    }
  };

  return (
    <>
      {!dbConnected && (
        <Box sx={{
          background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
          color: '#ffffff',
          px: 2,
          py: 1,
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '0.85rem',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1.5,
          boxShadow: '0 4px 10px rgba(239, 68, 68, 0.25)',
          position: 'relative',
          zIndex: 1201,
        }}>
          <span>⚠️ <strong>MongoDB Disconnected:</strong> Could not connect to MongoDB Atlas. Your IP address may not be whitelisted.</span>
          <Button
            href="https://cloud.mongodb.com/"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              boxShadow: 'none',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.75rem',
              py: 0.2,
              px: 1.5,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
                boxShadow: 'none',
              }
            }}
          >
            Manage Whitelist
          </Button>
        </Box>
      )}

      <HideOnScroll>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: mode === 'dark' ? 'rgba(18,18,26,0.7)' : 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          <Toolbar sx={{ gap: 1, px: { xs: 2, md: 4 } }}>
            {/* Logo */}
            <Box
              onClick={() => navigate('/')}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', mr: 3 }}
            >
              <FlashOnIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #2563EB, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                1% Battery
              </Typography>
            </Box>

            {/* Desktop nav links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flexGrow: 1 }}>
              {NAV_LINKS.map((link) => (
                <Typography
                  key={link.path}
                  component="button"
                  onClick={() => navigate(link.path)}
                  sx={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: location.pathname === link.path ? 700 : 500,
                    color: location.pathname === link.path ? 'primary.main' : 'text.secondary',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
                    transition: 'all 0.2s',
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>

            {/* Search */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                mr: 1,
                flex: { sm: 'none', md: '0 1 280px' },
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
              <InputBase
                placeholder="Search gadgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                sx={{ fontSize: '0.9rem', width: '100%' }}
              />
            </Box>

            {/* Theme toggle */}
            <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
              <IconButton onClick={toggleTheme} color="inherit" size="small">
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Cart */}
            <Tooltip title="Cart">
              <IconButton onClick={() => navigate('/cart')} color="inherit">
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Session / Sign In */}
            {currentUser ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
                {currentUser.isAdmin && (
                  <Tooltip title="Admin Settings">
                    <IconButton onClick={() => navigate('/admin/profile')} color="inherit">
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Avatar
                  onClick={() => navigate('/profile')}
                  src={currentUser.profileImage ? currentUser.profileImage : undefined}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {(!currentUser.profileImage && currentUser.name) ? currentUser.name[0].toUpperCase() : 'U'}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    display: { xs: 'none', lg: 'block' },
                    fontWeight: 700,
                    color: 'text.primary'
                  }}
                >
                  {currentUser.name}
                </Typography>
                <Button
                  variant="text"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  sx={{
                    display: { xs: 'none', md: 'inline-flex' },
                    color: 'text.secondary',
                    '&:hover': { color: 'error.main' }
                  }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/signin')}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  ml: 1,
                  borderWidth: '1.5px',
                  '&:hover': { borderWidth: '1.5px' }
                }}
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' } }}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Menu</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            {NAV_LINKS.map((link) => (
              <ListItem
                key={link.path}
                button
                onClick={() => { navigate(link.path); setDrawerOpen(false); }}
                sx={{
                  borderRadius: 2, mb: 0.5,
                  bgcolor: location.pathname === link.path ? 'action.selected' : 'transparent',
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{ fontWeight: location.pathname === link.path ? 700 : 400 }}
                />
              </ListItem>
            ))}
            {currentUser ? (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem sx={{ px: 2, py: 1 }} button onClick={() => { navigate('/profile'); setDrawerOpen(false); }}>
                  <Avatar src={currentUser.profileImage ? currentUser.profileImage : undefined} sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {(!currentUser.profileImage && currentUser.name) ? currentUser.name[0].toUpperCase() : 'U'}
                  </Avatar>
                  <ListItemText
                    primary={currentUser.name}
                    secondary={currentUser.email}
                    primaryTypographyProps={{ fontWeight: 700 }}
                  />
                </ListItem>
                {currentUser.isAdmin && (
                  <ListItem sx={{ px: 2, py: 1 }} button onClick={() => { navigate('/admin/profile'); setDrawerOpen(false); }}>
                    <SettingsIcon sx={{ color: 'text.secondary', mr: 2 }} />
                    <ListItemText primary="Admin Settings" primaryTypographyProps={{ fontWeight: 600 }} />
                  </ListItem>
                )}
                <ListItem
                  button
                  onClick={() => {
                    logout();
                    navigate('/');
                    setDrawerOpen(false);
                  }}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{ fontWeight: 600, color: 'error.main' }}
                  />
                </ListItem>
              </>
            ) : (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem
                  button
                  onClick={() => { navigate('/signin'); setDrawerOpen(false); }}
                  sx={{
                    borderRadius: 2, mb: 0.5,
                    bgcolor: location.pathname === '/signin' ? 'action.selected' : 'transparent',
                  }}
                >
                  <ListItemText
                    primary="Sign In"
                    primaryTypographyProps={{
                      fontWeight: location.pathname === '/signin' ? 700 : 600,
                      color: 'primary.main'
                    }}
                  />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
