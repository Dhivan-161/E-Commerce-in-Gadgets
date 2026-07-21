import React from 'react';
import {
  Box, Container, Typography, Grid, Card, CardMedia, CardContent,
  Button, Chip, Rating, Stack,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DiscountIcon from '@mui/icons-material/Discount';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../contexts/ProductContext';

const StudentDeals = () => {
  const navigate = useNavigate();
  const { products } = useProducts();

  // For demonstration, let's just use products that have a discount
  // Or we could take a subset of products and apply an extra student discount
  // We'll just show the deals for now, but style it for students
  const studentProducts = products.filter((p) => p.originalPrice);

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <SchoolIcon sx={{ fontSize: 40 }} />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>Student Deals</Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Exclusive discounts for students. Verify your student status to get an extra 10% off!
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <DiscountIcon />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>Up to 50% off on top tech gear</Typography>
          </Box>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ 
                mt: 4, 
                bgcolor: 'white', 
                color: '#3B82F6', 
                fontWeight: 700,
                '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)'
                }
            }}
          >
            Verify Student Status
          </Button>
        </Container>
      </Box>

      {/* Featured Offers */}
      <Container maxWidth="lg" sx={{ mt: -4, mb: 4, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          {[
            {
              title: "MacBook + Free AirPods",
              desc: "Get a free pair of AirPods with any Mac purchase for college.",
              color: "#EC4899" // Pink
            },
            {
              title: "iPad Pro Bundle",
              desc: "Save $150 when you bundle iPad Pro with Apple Pencil.",
              color: "#F59E0B" // Amber
            },
            {
              title: "Extra 15% Off Laptops",
              desc: "Use code UNIDAYS15 at checkout for extra savings on all laptops.",
              color: "#10B981" // Emerald
            }
          ].map((offer, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Card sx={{ 
                bgcolor: offer.color, 
                color: 'white', 
                height: '100%',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{offer.title}</Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>{offer.desc}</Typography>
                  <Button variant="contained" sx={{ bgcolor: 'white', color: offer.color, fontWeight: 700, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }}}>
                    Claim Offer
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Deals grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>All Student Discounts</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {studentProducts.length} products with special student pricing applied
        </Typography>
        <Grid container spacing={3}>
          {studentProducts.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
              {/* Wrapping ProductCard with a subtle border/badge could make it more "student" focused, but standard ProductCard is fine too */}
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

export default StudentDeals;
