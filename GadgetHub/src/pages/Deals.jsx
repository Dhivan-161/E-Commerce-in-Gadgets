import React from 'react';
import {
  Box, Container, Typography, Grid, Card, CardMedia, CardContent,
  Button, Chip, Rating, Stack,
} from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TimerIcon from '@mui/icons-material/Timer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../contexts/ProductContext';

const Deals = () => {
  const navigate = useNavigate();
  const { products } = useProducts();

  // Products with a discount
  const dealProducts = products.filter((p) => p.originalPrice);

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #F97316 0%, #2563EB 100%)',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <LocalFireDepartmentIcon sx={{ fontSize: 40 }} />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>Hot Deals</Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Limited-time offers — grab them before they're gone!
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <TimerIcon />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>Deals refresh every 24 hours</Typography>
          </Box>
        </Container>
      </Box>

      {/* Deals grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Today's Deals</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {dealProducts.length} products on sale right now
        </Typography>
        <Grid container spacing={3}>
          {dealProducts.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/products')}
          >
            Browse All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Deals;
