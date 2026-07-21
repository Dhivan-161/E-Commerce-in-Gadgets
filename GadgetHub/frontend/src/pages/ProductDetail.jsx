import React, { useState } from 'react';
import {
  Box, Container, Typography, Button, Grid, Chip, Avatar,
  Stack, Tabs, Tab, Rating, Divider, IconButton, Tooltip,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [wished, setWished] = useState(false);
  const [tab, setTab] = useState(0);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const product = products.find((p) => String(p.id) === String(id) || String(p._id) === String(id));
  const related = products.filter((p) => p.category === product?.category && String(p.id || p._id) !== String(product?.id || product?._id)).slice(0, 4);

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Product not found</Typography>
        <Button onClick={() => navigate('/products')} startIcon={<ArrowBackIcon />}>Back to Products</Button>
      </Container>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back
      </Button>

      <Grid container spacing={5}>
        {/* Image */}
        <Grid size={{ xs: 12, md: 6 }} >
          <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', bgcolor: 'background.paper', backdropFilter: 'blur(16px)', border: '1px solid', borderColor: 'divider', p: 2, boxShadow: 3 }}>
            {product.badge && (
              <Chip label={product.badge} color="primary" size="small" sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1, fontWeight: 700 }} />
            )}
            {discount && (
              <Chip label={`-${discount}%`} color="error" size="small" sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1, fontWeight: 700 }} />
            )}
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{ width: '100%', height: 380, objectFit: 'cover', borderRadius: 3 }}
            />
          </Box>
        </Grid>

        {/* Details */}
        <Grid size={{ xs: 12, md: 6 }} >
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
            {product.category}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, mb: 2, lineHeight: 1.2 }}>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Rating value={product.rating || 5} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary">
              {product.rating || 5} ({(product.reviews || 0).toLocaleString()} reviews)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
            <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800 }}>
              ₹{product.price}
            </Typography>
            {product.originalPrice && (
              <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ₹{product.originalPrice}
              </Typography>
            )}
            {discount && (
              <Chip label={`Save ₹{discount}%`} color="success" size="small" sx={{ fontWeight: 700 }} />
            )}
          </Box>

          <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>{product.description}</Typography>

          {/* Specs */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Key Features</Typography>
            <Stack spacing={0.5}>
              {(product.specs || []).map((spec) => (
                <Box key={spec} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
                  <Typography variant="body2">{spec}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* In stock */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>In Stock — Ready to Ship</Typography>
          </Box>

          {/* Quantity + Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
              <IconButton size="small" onClick={() => setQty(Math.max(1, qty - 1))}>−</IconButton>
              <Typography sx={{ px: 2, fontWeight: 700 }}>{qty}</Typography>
              <IconButton size="small" onClick={() => setQty(qty + 1)}>+</IconButton>
            </Box>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              sx={{ flex: 1 }}
              color={added ? 'success' : 'primary'}
            >
              {added ? 'Added! ✓' : 'Add to Cart'}
            </Button>
            <Tooltip title="Wishlist">
              <IconButton onClick={() => setWished(!wished)} sx={{ border: '1px solid', borderColor: 'divider' }}>
                {wished ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton sx={{ border: '1px solid', borderColor: 'divider' }}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ mt: 6 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 3 }}>
          <Tab label="Description" />
          <Tab label="Specifications" />
          <Tab label="Reviews" />
        </Tabs>
        {tab === 0 && (
          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>{product.description}</Typography>
        )}
        {tab === 1 && (
          <Stack spacing={1}>
            {(product.specs || []).map((spec) => (
              <Box key={spec} sx={{ display: 'flex', gap: 2 }}>
                <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20, mt: 0.2 }} />
                <Typography>{spec}</Typography>
              </Box>
            ))}
          </Stack>
        )}
        {tab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h2" sx={{ fontWeight: 800 }}>{product.rating || 5}</Typography>
              <Box>
                <Rating value={product.rating || 5} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">{(product.reviews || 0).toLocaleString()} reviews</Typography>
              </Box>
            </Box>
            <Typography color="text.secondary">Detailed reviews coming soon.</Typography>
          </Box>
        )}
      </Box>

      {/* Related products */}
      {related.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Related Products</Typography>
          <Grid container spacing={3}>
            {related.map((p) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={p.id}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetail;
