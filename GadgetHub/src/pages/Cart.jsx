import React from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia,
  Button, IconButton, Divider, TextField, Stack, Chip, Alert,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Your cart is empty</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Looks like you haven't added anything yet. Start shopping!
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/products')}>
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)
      </Typography>

      {cartTotal >= 50 && (
        <Alert
          icon={<LocalShippingIcon />}
          severity="success"
          sx={{ mb: 3, borderRadius: 3 }}
        >
          🎉 You qualify for FREE shipping!
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Cart items */}
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {cart.map((item) => (
              <Card key={item.id} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
                    sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2, cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${item.id}`)}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{item.category}</Typography>
                    <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 700, mt: 0.5 }}>
                      ${item.price}
                    </Typography>
                  </Box>

                  {/* Quantity controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ px: 2, fontWeight: 700, minWidth: 32, textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeFromCart(item.id)}
                      color="error"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>

          <Button
            variant="outlined"
            color="error"
            onClick={clearCart}
            sx={{ mt: 2 }}
            size="small"
          >
            Clear Cart
          </Button>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Order Summary</Typography>

            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography sx={{ fontWeight: 600 }}>${cartTotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography sx={{ fontWeight: 600, color: shipping === 0 ? 'success.main' : 'inherit' }}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Tax (8%)</Typography>
                <Typography sx={{ fontWeight: 600 }}>${tax.toFixed(2)}</Typography>
              </Box>
            </Stack>

            {cartTotal < 50 && (
              <Alert severity="info" sx={{ mt: 2, borderRadius: 2, fontSize: '0.8rem' }}>
                Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>${total.toFixed(2)}</Typography>
            </Box>

            {/* Promo code */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <TextField placeholder="Promo code" size="small" sx={{ flexGrow: 1 }} />
              <Button variant="outlined" size="small">Apply</Button>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/checkout')}
              sx={{ mb: 2, py: 1.5 }}
            >
              Proceed to Checkout
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              <LockIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">Secure 256-bit SSL encryption</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
