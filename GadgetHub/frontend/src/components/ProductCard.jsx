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
import { formatPrice } from '../utils/currency';

const badgeColors = {
  'Best Seller': 'warning',
  'New': 'success',
  'Top Rated': 'info',
  'Premium': 'secondary',
  'Hot': 'error',
};

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&q=80';

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [wished, setWished] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [imgSrc, setImgSrc] = useState(product?.image || DEFAULT_FALLBACK_IMAGE);

  const productId = product?.id || product?._id;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setSnackbar(true);
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const cartItem = cart.find(item => item.id === productId);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <>
      <Card
        onClick={() => navigate(`/product/${productId}`)}
        sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
      >
        {/* Badge */}
        {product?.badge && (
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
          image={imgSrc}
          alt={product?.name || 'Product'}
          onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
          sx={{ height: 200, objectFit: 'cover', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
        />

        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em' }}>
            {product?.category || 'General'}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.5, lineHeight: 1.3 }}>
            {product?.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Rating value={product?.rating || 5} precision={0.1} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">
              ({(product?.reviews || 0).toLocaleString()})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1.5 }}>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
              {formatPrice(product?.price)}
            </Typography>
            {product?.originalPrice && (
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                {formatPrice(product.originalPrice)}
              </Typography>
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
          {quantity > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', flexGrow: 1, justifyContent: 'space-between', height: '30px' }}>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); updateQuantity(productId, quantity - 1); }}>−</IconButton>
              <Typography sx={{ px: 1, fontWeight: 700, fontSize: '0.85rem' }}>{quantity}</Typography>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); updateQuantity(productId, quantity + 1); }}>+</IconButton>
            </Box>
          ) : (
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              fullWidth
              size="small"
              sx={{ height: '30px' }}
            >
              Add to Cart
            </Button>
          )}
          <Tooltip title="Quick View">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); navigate(`/product/${productId}`); }}
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
