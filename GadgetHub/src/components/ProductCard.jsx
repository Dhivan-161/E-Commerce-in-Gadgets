import React, { useState } from 'react';
import {
  Card, CardMedia, CardContent, CardActions, Typography,
  Button, IconButton, Chip, Box, Rating, Tooltip, Snackbar, Alert,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const badgeColors = {
  'Best Seller': 'warning',
  'New': 'success',
  'Top Rated': 'info',
  'Premium': 'secondary',
  'Hot': 'error',
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [wished, setWished] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setSnackbar(true);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <>
      <Card
        onClick={() => navigate(`/product/${product.id}`)}
        sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
      >
        {/* Badge */}
        {product.badge && (
          <Chip
            label={product.badge}
            color={badgeColors[product.badge] || 'primary'}
            size="small"
            sx={{ position: 'absolute', top: 12, left: 12, zIndex: 1, fontWeight: 700, fontSize: '0.7rem' }}
          />
        )}

        {/* Discount badge */}
        {discount && (
          <Chip
            label={`-${discount}%`}
            color="error"
            size="small"
            sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1, fontWeight: 700, fontSize: '0.7rem' }}
          />
        )}

        {/* Wishlist button */}
        <IconButton
          onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
          sx={{
            position: 'absolute', top: discount ? 44 : 12, right: 12, zIndex: 1,
            bgcolor: 'background.paper', boxShadow: 1,
            '&:hover': { bgcolor: 'background.paper', transform: 'scale(1.1)' },
          }}
          size="small"
        >
          {wished ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>

        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{ height: 200, objectFit: 'cover', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
        />

        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em' }}>
            {product.category}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.5, lineHeight: 1.3 }}>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Rating value={product.rating} precision={0.1} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">
              ({product.reviews.toLocaleString()})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1.5 }}>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
              ${product.price}
            </Typography>
            {product.originalPrice && (
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ${product.originalPrice}
              </Typography>
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            fullWidth
            size="small"
          >
            Add to Cart
          </Button>
          <Tooltip title="Quick View">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>

      <Snackbar
        open={snackbar}
        autoHideDuration={2500}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar(false)} severity="success" variant="filled" sx={{ borderRadius: 3 }}>
          Added to cart! 🛒
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;
