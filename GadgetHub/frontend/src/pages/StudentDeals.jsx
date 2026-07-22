import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Button, Dialog, DialogTitle, DialogContent, DialogContentText, 
  DialogActions, TextField, Snackbar, Alert, Accordion, 
  AccordionSummary, AccordionDetails
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DiscountIcon from '@mui/icons-material/Discount';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../contexts/ProductContext';

const StudentDeals = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const studentProducts = products.filter((p) => p.originalPrice);

  // States
  const [isVerified, setIsVerified] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleVerifySubmit = () => {
    if (!emailInput) {
      setEmailError('Please enter an email address');
      return;
    }
    if (!emailInput.endsWith('.edu') && !emailInput.endsWith('.ac')) {
      setEmailError('Please enter a valid .edu or .ac student email address');
      return;
    }
    setEmailError('');
    setIsVerified(true);
    setVerifyModalOpen(false);
    setSnackbar({ open: true, message: 'Student status verified! Your discount code is STUDENT20', severity: 'success' });
  };

  const handleClaimOffer = (promoCode) => {
    navigator.clipboard.writeText(promoCode);
    setSnackbar({ open: true, message: `Promo code ${promoCode} copied to clipboard!`, severity: 'success' });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

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
            <SchoolIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' } }}>
              Student Deals
            </Typography>
          </Box>
          
          {isVerified ? (
            <Box sx={{ mt: 3, mb: 4, p: 3, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 2, display: 'inline-block' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mb: 1 }}>
                <CheckCircleIcon sx={{ color: '#4ADE80' }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#4ADE80' }}>
                  Student Status Verified
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Your active discount code is: <Box component="span" sx={{ fontWeight: 800, bgcolor: 'white', color: '#3B82F6', px: 1, py: 0.5, borderRadius: 1, ml: 1 }}>STUDENT20</Box>
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                Exclusive discounts for students. Verify your student status to get an extra 20% off!
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <DiscountIcon />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Up to 50% off on top tech gear</Typography>
              </Box>
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => setVerifyModalOpen(true)}
                sx={{ 
                    mt: 4, 
                    bgcolor: 'white', 
                    color: '#3B82F6', 
                    fontWeight: 700,
                    px: { xs: 3, md: 5 },
                    py: { xs: 1.5, md: 2 },
                    '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)'
                    }
                }}
              >
                Verify Student Status
              </Button>
            </>
          )}
        </Container>
      </Box>

      {/* Featured Offers */}
      <Container maxWidth="lg" sx={{ mt: -4, mb: { xs: 4, md: 8 }, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          {[
            {
              title: "MacBook + Free AirPods",
              desc: "Get a free pair of AirPods with any Mac purchase for college.",
              color: "#EC4899", // Pink
              code: "FREPODS"
            },
            {
              title: "iPad Pro Bundle",
              desc: "Save $150 when you bundle iPad Pro with Apple Pencil.",
              color: "#F59E0B", // Amber
              code: "PROBUNDLE"
            },
            {
              title: "Extra 15% Off Laptops",
              desc: "Use code UNIDAYS15 at checkout for extra savings on all laptops.",
              color: "#10B981", // Emerald
              code: "UNIDAYS15"
            }
          ].map((offer, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Card sx={{ 
                bgcolor: offer.color, 
                color: 'white', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent sx={{ p: { xs: 3, md: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{offer.title}</Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, flexGrow: 1 }}>{offer.desc}</Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => handleClaimOffer(offer.code)}
                    startIcon={<ContentCopyIcon />}
                    sx={{ 
                      bgcolor: 'white', 
                      color: offer.color, 
                      fontWeight: 700, 
                      alignSelf: 'flex-start',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    Claim Offer
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Deals grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>All Student Discounts</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {studentProducts.length} products with special pricing applied
        </Typography>
        <Grid container spacing={3}>
          {studentProducts.map((product) => (
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

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 }, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>Who is eligible for student discounts?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Any student enrolled in a degree-granting college or university can claim student discounts. 
              You must verify your status using a valid .edu or .ac university email address.
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>How do I apply my promo code?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Once you verify your student status or copy a promo code from an offer above, 
              simply paste the code into the "Promo Code" field during the checkout process and click "Apply" to see your savings.
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>Can I combine student discounts with other sales?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              In most cases, student discounts cannot be combined with sitewide seasonal sales (like Black Friday), 
              but they do apply to clearance items. Check the terms of specific promo codes for exceptions.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>

      {/* Verification Modal */}
      <Dialog open={verifyModalOpen} onClose={() => setVerifyModalOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Verify Student Status</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            To unlock your exclusive student discount, please enter your valid university email address (ending in .edu or .ac).
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="University Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            placeholder="student@university.edu"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setVerifyModalOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleVerifySubmit} variant="contained" color="primary">
            Verify Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentDeals;
