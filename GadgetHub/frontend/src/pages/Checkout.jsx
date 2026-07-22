import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, TextField, Button,
  Stepper, Step, StepLabel, Card, Divider, Stack, Alert,
  FormControl, InputLabel, Select, MenuItem, RadioGroup, Radio, Checkbox, FormControlLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../services/api';
import { formatPrice } from '../utils/currency';

const STEPS = ['Shipping & Billing', 'Payment', 'Review'];

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState('');
  
  // Extra feature states
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
    billingAddress: '', billingCity: '', billingState: '', billingZip: '', billingCountry: 'US',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });

  const handleApplyPromo = () => {
    setError('');
    if (promoCode.toUpperCase() === 'STUDENT20') {
      setDiscountPercent(0.20);
    } else if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscountPercent(0.10);
    } else if (promoCode.trim() === '') {
      setDiscountPercent(0);
    } else {
      setError('Invalid or expired promo code');
      setDiscountPercent(0);
    }
  };

  const discountAmount = cartTotal * discountPercent;
  const subtotalAfterDiscount = cartTotal - discountAmount;
  const shipping = subtotalAfterDiscount >= 4999 ? 0 : 499;
  const tax = subtotalAfterDiscount * 0.08;
  const total = subtotalAfterDiscount + shipping + tax;

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
        billingInfo: sameAsShipping ? {
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        } : {
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.billingAddress,
          city: form.billingCity,
          state: form.billingState,
          zip: form.billingZip,
          country: form.billingCountry,
        },
        paymentInfo: {
          method: paymentMethod,
          ...(paymentMethod === 'credit_card' && {
            cardName: form.cardName,
            cardNumber: form.cardNumber,
            expiry: form.expiry,
          }),
        },
        discountApplied: discountAmount,
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
        <Grid item xs={12} md={8}>
          {step === 0 && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Shipping Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Address" name="address" value={form.address} onChange={handleChange} required />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="City" name="city" value={form.city} onChange={handleChange} required />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="State / Province" name="state" value={form.state} onChange={handleChange} required />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="ZIP / Postal Code" name="zip" value={form.zip} onChange={handleChange} required />
                </Grid>
                <Grid item xs={6}>
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

              <Box sx={{ mt: 3, mb: 2 }}>
                <FormControlLabel
                  control={<Checkbox checked={sameAsShipping} onChange={(e) => setSameAsShipping(e.target.checked)} color="primary" />}
                  label="Billing address is same as shipping address"
                />
              </Box>

              {!sameAsShipping && (
                <Box sx={{ mt: 2, mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Billing Address</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Address" name="billingAddress" value={form.billingAddress} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="City" name="billingCity" value={form.billingCity} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="State / Province" name="billingState" value={form.billingState} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="ZIP / Postal Code" name="billingZip" value={form.billingZip} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Country</InputLabel>
                        <Select name="billingCountry" value={form.billingCountry} onChange={handleChange} label="Country">
                          <MenuItem value="US">United States</MenuItem>
                          <MenuItem value="UK">United Kingdom</MenuItem>
                          <MenuItem value="CA">Canada</MenuItem>
                          <MenuItem value="AU">Australia</MenuItem>
                          <MenuItem value="IN">India</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Button variant="contained" sx={{ mt: 3 }} onClick={() => setStep(1)}>
                Continue to Payment
              </Button>
            </Card>
          )}

          {step === 1 && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Payment Method</Typography>
              
              <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                <RadioGroup 
                  row 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  sx={{ display: 'flex', gap: 2 }}
                >
                  <Box sx={{ border: '1px solid', borderColor: paymentMethod === 'credit_card' ? 'primary.main' : 'divider', borderRadius: 2, p: 1, flex: 1 }}>
                    <FormControlLabel value="credit_card" control={<Radio />} label="Credit Card" sx={{ width: '100%', m: 0 }} />
                  </Box>
                  <Box sx={{ border: '1px solid', borderColor: paymentMethod === 'paypal' ? 'primary.main' : 'divider', borderRadius: 2, p: 1, flex: 1 }}>
                    <FormControlLabel value="paypal" control={<Radio />} label="PayPal" sx={{ width: '100%', m: 0 }} />
                  </Box>
                  <Box sx={{ border: '1px solid', borderColor: paymentMethod === 'apple_pay' ? 'primary.main' : 'divider', borderRadius: 2, p: 1, flex: 1 }}>
                    <FormControlLabel value="apple_pay" control={<Radio />} label="Apple / Google Pay" sx={{ width: '100%', m: 0 }} />
                  </Box>
                </RadioGroup>
              </FormControl>

              {paymentMethod === 'credit_card' ? (
                <>
                  <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    This is a demo. No real payment will be processed.
                  </Alert>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Name on Card" name="cardName" value={form.cardName} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Card Number" name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="•••• •••• •••• ••••" required />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="Expiry Date" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" required />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="CVV" name="cvv" value={form.cvv} onChange={handleChange} placeholder="•••" required />
                    </Grid>
                  </Grid>
                </>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    You will be securely redirected to {paymentMethod === 'paypal' ? 'PayPal' : 'Apple / Google Pay'} in the next step.
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button variant="outlined" onClick={() => setStep(0)}>Back</Button>
                <Button variant="contained" onClick={() => setStep(2)}>Review Order</Button>
              </Box>
            </Card>
          )}

          {step === 2 && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Review Your Order</Typography>
              
              <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Shipping To:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{form.firstName} {form.lastName}</Typography>
                <Typography variant="body2">{form.address}</Typography>
                <Typography variant="body2">{form.city}, {form.state} {form.zip}</Typography>
                <Typography variant="body2">{form.country}</Typography>
              </Box>

              <Stack spacing={2}>
                {cart.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box component="img" src={item.image} alt={item.name} sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Qty: {item.quantity}</Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {formatPrice(item.price * item.quantity)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => setStep(1)}>Back</Button>
                <Button variant="contained" color="success" onClick={handlePlaceOrder} sx={{ flex: 1, py: 1.5, fontWeight: 700, fontSize: '1.1rem' }}>
                  Place Order — {formatPrice(total)}
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
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Order Summary</Typography>
            
            {/* Promo Code Section */}
            <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
              <TextField 
                size="small" 
                placeholder="Promo Code" 
                fullWidth 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                InputProps={{
                  startAdornment: <LocalOfferIcon sx={{ color: 'text.secondary', fontSize: 18, mr: 1 }} />
                }}
              />
              <Button variant="outlined" onClick={handleApplyPromo} disabled={!promoCode.trim()}>Apply</Button>
            </Box>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography sx={{ fontWeight: 600 }}>{formatPrice(cartTotal)}</Typography>
              </Box>

              {discountPercent > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'rgba(74, 222, 128, 0.1)', p: 1, borderRadius: 1 }}>
                  <Typography color="success.main" sx={{ fontWeight: 600 }}>Discount ({(discountPercent * 100).toFixed(0)}%)</Typography>
                  <Typography color="success.main" sx={{ fontWeight: 700 }}>-{formatPrice(discountAmount)}</Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography sx={{ fontWeight: 600, color: shipping === 0 ? 'success.main' : 'inherit' }}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Tax (8%)</Typography>
                <Typography sx={{ fontWeight: 600 }}>{formatPrice(tax)}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>{formatPrice(total)}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
