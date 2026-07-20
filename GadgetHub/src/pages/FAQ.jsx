import React, { useState, useMemo } from 'react';
import {
  Box, Container, Typography, TextField, Tabs, Tab, Accordion,
  AccordionSummary, AccordionDetails, Card, CardContent, Button, Stack,
  InputAdornment, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useNavigate } from 'react-router-dom';

const FAQS = [
  {
    category: 'general',
    question: 'Are the products on 1% Battery authentic and brand new?',
    answer: 'Absolutely. Every gadget, laptop, smartphone, or accessory sold on 1% Battery is 100% authentic, brand new, and sourced directly from manufacturers or authorized global distributors. They all come in their original factory packaging with manufacturer warranties.'
  },
  {
    category: 'general',
    question: 'Do I need to register for an account to place an order?',
    answer: 'While you can check out as a guest, we highly recommend creating an account. Having a 1% Battery account allows you to securely save payment details, view order histories, track shipments in real-time, and collect loyalty reward points for future discounts.'
  },
  {
    category: 'general',
    question: 'How do I contact customer support?',
    answer: 'You can reach out to us at any time via our Contact page. We also offer email support (support@1% Battery.tech) and a toll-free customer hotline (+1 (800) 555-0199) active Monday through Friday, 9:00 AM to 6:00 PM EST.'
  },
  {
    category: 'shipping',
    question: 'How much does shipping cost?',
    answer: 'We offer FREE standard shipping on all orders over ₹4,999 within the continental United States. For orders below ₹4,999, a flat-rate shipping fee of ₹499 is applied at checkout. Express or overnight delivery rates are calculated based on your address.'
  },
  {
    category: 'shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes, 1% Battery ships to over 30 countries worldwide. International shipping charges and customs fees are calculated at checkout based on the destination. Delivery times typically range between 7 to 15 business days depending on customs processing.'
  },
  {
    category: 'shipping',
    question: 'How can I track my order?',
    answer: 'Once your order is processed and leaves our warehouse (usually within 24-48 hours), you will receive a shipping confirmation email containing a carrier tracking link (FedEx, UPS, or DHL). You can also track your order directly inside the account portal.'
  },
  {
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day money-back guarantee on all products. If you are not completely satisfied with your purchase, you can initiate a return within 30 days of delivery. The item must be in its original condition and packaging. Please visit our Help Center to print a return shipping label.'
  },
  {
    category: 'returns',
    question: 'When will I get my refund?',
    answer: 'Once we receive and inspect your returned item at our warehouse, we will process your refund back to the original payment method. This usually takes 5 to 7 business days depending on your financial institution.'
  },
  {
    category: 'returns',
    question: 'Do products come with a warranty?',
    answer: 'Yes, all electronic devices and gadgets purchased on 1% Battery are covered by their respective manufacturer warranties. This warranty duration is typically 1 year but can vary by brand and product type. Check the product details page for specific information.'
  },
  {
    category: 'payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and major shopping financing options like Affirm or Klarna, allowing you to buy now and pay in installments.'
  },
  {
    category: 'payments',
    question: 'Is it safe to use my credit card on 1% Battery?',
    answer: 'Security is our top priority. We use industry-standard Secure Sockets Layer (SSL) encryption protocol to protect your personal information and credit card details. We do not store full credit card numbers on our servers; payments are processed securely via Stripe or PayPal.'
  },
  {
    category: 'payments',
    question: 'Can I apply multiple discount codes at checkout?',
    answer: 'Only one promo code or coupon code can be applied per order. However, promo codes can generally be combined with auto-applied free shipping discounts if your order subtotal is over ₹4,999.'
  }
];

const FAQ = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredFaqs = useMemo(() => {
    return FAQS.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || faq.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero */}
      <Box
        sx={{
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #12121A 0%, #1A1A2E 100%)'
            : 'linear-gradient(135deg, #F0F2FF 0%, #F8F9FF 100%)',
          py: { xs: 8, md: 10 },
          textAlign: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          mb: 6
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Frequently Asked Questions</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, opacity: 0.9, mb: 4 }}>
            Find answers to common questions about shipping, orders, payments, returns, and warranties.
          </Typography>

          {/* Search bar inside Hero */}
          <Card sx={{ maxWidth: 600, mx: 'auto', p: 0.5, borderRadius: 3 }}>
            <TextField
              fullWidth
              placeholder="Search your question here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { border: 'none', '& fieldset': { border: 'none' } }
              }}
            />
          </Card>
        </Container>
      </Box>

      <Container maxWidth="md">
        {/* Category Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '0.95rem',
                minWidth: { xs: 'auto', sm: 120 }
              }
            }}
          >
            <Tab label="All Questions" value="all" />
            <Tab label="General" value="general" />
            <Tab label="Shipping & Delivery" value="shipping" />
            <Tab label="Returns & Warranty" value="returns" />
            <Tab label="Payments & Pricing" value="payments" />
          </Tabs>
        </Box>

        {/* FAQs Accordions */}
        {filteredFaqs.length > 0 ? (
          <Stack spacing={2}>
            {filteredFaqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  borderRadius: '12px !important',
                  overflow: 'hidden',
                  '&.Mui-expanded': {
                    borderColor: 'primary.main',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                      ? '0 4px 20px rgba(108, 99, 255, 0.15)'
                      : '0 4px 20px rgba(108, 99, 255, 0.08)'
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="primary" />}
                  sx={{ py: 1, px: 3, '& .MuiAccordionSummary-content': { fontWeight: 700 } }}
                >
                  <Typography variant="subtitle1" sx={{ pr: 2 }}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        ) : (
          <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              No Results Found
            </Typography>
            <Typography color="text.secondary">
              We couldn't find any questions matching "{searchQuery}". Try refining your keywords or checking another category.
            </Typography>
          </Card>
        )}

        {/* CTA Footer */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Card
            sx={{
              p: { xs: 4, md: 5 },
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#12121A' : '#F0F2FF',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
                Still Have Questions?
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                Can't find the answer you're looking for? Please contact our friendly support team for assistance.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<MailOutlineIcon />}
                onClick={() => navigate('/contact')}
                sx={{ px: 4, py: 1.2 }}
              >
                Contact Customer Support
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;
