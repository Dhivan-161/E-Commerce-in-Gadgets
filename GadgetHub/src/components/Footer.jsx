import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, IconButton, Stack } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = {
    Shop: [
      { label: 'Smartphones', path: '/products' },
      { label: 'Laptops', path: '/products' },
      { label: 'Tablets', path: '/products' },
      { label: 'Audio', path: '/products' },
      { label: 'Wearables', path: '/products' },
    ],
    Company: [
      { label: 'About Us', path: '/about' },
      { label: 'Careers', path: '/about' },
      { label: 'Press', path: '/about' },
      { label: 'Blog', path: '/about' },
    ],
    Support: [
      { label: 'Help Center', path: '/faq' },
      { label: 'Shipping', path: '/faq' },
      { label: 'Returns', path: '/faq' },
      { label: 'Contact Us', path: '/contact' },
    ],
    Legal: [
      { label: 'Privacy Policy', path: '/terms' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/terms' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }} >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <FlashOnIcon sx={{ color: 'primary.main' }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #2563EB, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                1% Battery
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
              Your one-stop shop for the latest and greatest gadgets, electronics, and tech accessories. Free shipping on orders over ?4,999.
            </Typography>
            <Stack direction="row" spacing={1}>
              {[FacebookIcon, TwitterIcon, InstagramIcon, YouTubeIcon].map((Icon, i) => (
                <IconButton key={i} size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid size={{ xs: 6, sm: 3, md: 2 }} key={category}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                {category}
              </Typography>
              <Stack spacing={1}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    component="button"
                    onClick={() => navigate(link.path)}
                    underline="none"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      '&:hover': { color: 'primary.main' },
                      transition: 'color 0.2s',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} 1% Battery. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ?? Secure Payments &nbsp;|&nbsp; ?? Free Shipping &nbsp;|&nbsp; ?? Easy Returns
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
