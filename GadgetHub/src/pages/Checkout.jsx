import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, TextField, Button,
  Stepper, Step, StepLabel, Card, Divider, Stack, Alert,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../services/api';

const STEPS = ['Shipping Info', 'Payment', 'Review'];

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });

  const shipping = cartTotal >= 4999 ? 0 : 499;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    try {
      setError('');
      const orderData = {
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingInfo: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        paymentInfo: {
          cardName: form.cardName,
          cardNumber: form.cardNumber,
          expiry: form.expiry,
        },
        tax,
        shipping,
        total,
      };

      await createOrder(orderData);
      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    }
  };

  if (orderPlaced) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Order Placed!</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Thank you for your purchase! You'll receive a confirmation email shortly.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>Checkout</Typography>
      <Stepper activeStep={step} sx={{ mb: 5 }}>
        {STEPS.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }} >
          {step === 0 && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Shipping Information</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }} >
                  <TextField fullWidth label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 6 }} >
                  <TextField fullWidth label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 12 }} >
                  <TextField fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 12 }} >
                  <TextField fullWidth label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12 }} >
                  <TextField fullWidth label="Address" name="address" value={form.address} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 6 }} >
                  <TextField fullWidth label="City" name="city" value={form.city} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 6 }} >
                  <TextField fullWidth label="State / Province" name="state" value={form.state} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 6 }} >
                  <TextField fullWidth label="ZIP / Postal Code" name="zip" value={form.zip} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 6 }} >
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select name="country" value={form.country} onChange={handleChange} label="Country">
                      <MenuItem value="US">United States</MenuItem>
                      <MenuItem value="UK">United Kingdom</MenuItem>
                      <MenuItem value="CA">Canada</MenuItem>
                      <MenuItem value="AU">Australia</MenuItem>
                      <MenuItem value="IN">India</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button variant="contained" sx={{ mt: 3 }} onClick={() => setStep(1)}>
                Continue to Payment
              </Button>
            </Card>
          )}

          {step === 1 && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Payment Information</Typography>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                This is a demo. No real payment will be processed.
              </Alert>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }} >
                  <TextField fullWidth label="Name on Card" name="cardName" value={form.cardName} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 12 }} >
                  <TextField fullWidth label="Card Number" name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="•••• •••• •••• ••••" required />
                </Grid>
                <Grid size={{ xs: 6 }} >
                  <TextField fullWidth label="Expiry Date" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" required />
                </Grid>
                <Grid size={{ xs: 6 }} >
                  <TextField fullWidth label="CVV" name="cvv" value={form.cvv} onChange={handleChange} placeholder="•••" required />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={() => setStep(0)}>Back</Button>
                <Button variant="contained" onClick={() => setStep(2)}>Review Order</Button>
              </Box>
            </Card>
          )}

          {step === 2 && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Review Your Order</Typography>
              <Stack spacing={2}>
                {cart.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box component="img" src={item.image} alt={item.name} sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Qty: {item.quantity}</Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => setStep(1)}>Back</Button>
                <Button variant="contained" color="success" onClick={handlePlaceOrder} sx={{ flex: 1, py: 1.5 }}>
                  Place Order — ${total.toFixed(2)}
                </Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 2 }}>
                <LockIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">Your data is protected with 256-bit SSL encryption</Typography>
              </Box>
            </Card>
          )}
        </Grid>

        {/* Order summary sidebar */}
        <Grid size={{ xs: 12, md: 4 }} >
          <Card sx={{ p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Order Summary</Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography sx={{ fontWeight: 600 }}>₹{cartTotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography sx={{ fontWeight: 600, color: shipping === 0 ? 'success.main' : 'inherit' }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Tax</Typography>
                <Typography sx={{ fontWeight: 600 }}>₹{tax.toFixed(2)}</Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>₹{total.toFixed(2)}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
