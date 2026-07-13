import React from 'react';
import {
  Box, Container, Typography, Button, Grid, Chip,
  Card, CardContent, Avatar, Stack, useTheme,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LoopIcon from '@mui/icons-material/Loop';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../data/products';

const FeatureItem = ({ icon, title, description }) => (
  <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 2 }}>
      {icon}
    </Avatar>
    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{title}</Typography>
    <Typography variant="body2" color="text.secondary">{description}</Typography>
  </Card>
);

const FEATURES = [
  { icon: <LocalShippingIcon />, title: 'Free Shipping', description: 'Free delivery on orders over $50 — worldwide.' },
  { icon: <SecurityIcon />, title: 'Secure Payment', description: 'Your payment info is always protected & encrypted.' },
  { icon: <SupportAgentIcon />, title: '24/7 Support', description: 'Expert support available around the clock.' },
  { icon: <LoopIcon />, title: 'Easy Returns', description: '30-day hassle-free returns & full refunds.' },
];

const TESTIMONIALS = [
  { name: 'Sarah J.', text: 'Amazing store! Got my iPhone in 2 days and the packaging was flawless.', rating: 5, avatar: 'S' },
  { name: 'Mike T.', text: 'Best prices I could find anywhere. The Sony headphones are incredible!', rating: 5, avatar: 'M' },
  { name: 'Priya K.', text: 'Customer support was super helpful when I had a question about my order.', rating: 5, avatar: 'P' },
];

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <Box>
      {/* ── Hero ── */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #16213E 100%)'
            : 'linear-gradient(135deg, #F8F9FF 0%, #EEF0FF 50%, #F5F0FF 100%)',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)',
          top: -100, right: -100,
        }} />
        <Box sx={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,101,132,0.12) 0%, transparent 70%)',
          bottom: -80, left: -80,
        }} />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip label="🔥 Hot Deals This Week" color="secondary" sx={{ mb: 3, fontWeight: 700 }} />
              <Typography
                variant="h2"
                sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1.1 }}
              >
                Discover the{' '}
                <Box
                  component="span"
                  sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  Future
                </Box>{' '}
                of Tech
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, fontWeight: 400 }}>
                Shop the latest gadgets, electronics, and accessories. Premium quality at unbeatable prices with free shipping on all orders over $50.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/products')}
                  sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/deals')}
                  sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                >
                  View Deals
                </Button>
              </Stack>

              {/* Stats */}
              <Stack direction="row" spacing={4} sx={{ mt: 5 }}>
                {[['50K+', 'Happy Customers'], ['500+', 'Products'], ['4.9★', 'Average Rating']].map(([num, label]) => (
                  <Box key={label}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>{num}</Typography>
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative', textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 380, height: 380, borderRadius: '50%', mx: 'auto',
                    background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,101,132,0.2))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'pulse 3s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.03)' },
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={PRODUCTS[0].image}
                    alt="Featured"
                    sx={{ width: 280, height: 280, objectFit: 'cover', borderRadius: 4, boxShadow: 8 }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Categories ── */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Shop by Category</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Find exactly what you're looking for</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.id}
              label={`${cat.icon} ${cat.label}`}
              onClick={() => navigate(cat.id === 'all' ? '/products' : `/products?category=${cat.id}`)}
              variant="outlined"
              sx={{
                py: 2.5, px: 1, fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
                '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' },
                transition: 'all 0.2s',
              }}
            />
          ))}
        </Stack>
      </Container>

      {/* ── Featured Products ── */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>Featured Products</Typography>
              <Typography color="text.secondary">Hand-picked for you this season</Typography>
            </Box>
            <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/products')}>
              View All
            </Button>
          </Box>
          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Features ── */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>Why Choose GadgetHub?</Typography>
        <Typography color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>Everything you need, exactly when you need it</Typography>
        <Grid container spacing={3}>
          {FEATURES.map((f) => (
            <Grid item xs={12} sm={6} md={3} key={f.title}>
              <FeatureItem {...f} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── Testimonials ── */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>What Our Customers Say</Typography>
          <Typography color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>Over 50,000 happy customers worldwide</Typography>
          <Grid container spacing={3}>
            {TESTIMONIALS.map((t) => (
              <Grid item xs={12} md={4} key={t.name}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#FFB400', fontSize: 18 }} />
                    ))}
                  </Stack>
                  <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', lineHeight: 1.7 }}>
                    "{t.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.9rem' }}>{t.avatar}</Avatar>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{t.name}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA Banner ── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
          py: 8, textAlign: 'center', color: 'white',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Ready to Upgrade Your Tech?</Typography>
          <Typography sx={{ mb: 4, opacity: 0.9 }}>Join thousands of tech enthusiasts and discover deals you won't find anywhere else.</Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              bgcolor: 'white', color: 'primary.main', px: 5, py: 1.5,
              fontWeight: 700, '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Start Shopping
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
