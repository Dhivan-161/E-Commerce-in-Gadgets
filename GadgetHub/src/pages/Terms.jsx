import React, { useState } from 'react';
import {
  Box, Container, Typography, Tab, Tabs, Card, CardContent, Divider, Grid
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Terms = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const SECTIONS = [
    {
      title: 'Introduction & Agreement',
      icon: <GavelIcon />,
      content: (
        <>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>1. Welcome to GadgetHub</Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            These Terms and Conditions govern your use of the GadgetHub website located at gadgethub.tech and all related services, products, tools, and content provided by GadgetHub.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            By accessing or using our website, purchasing gadgets, or engaging with our service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must immediately cease using the website.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            We reserve the right, at our sole discretion, to modify, update, or replace any part of these Terms. It is your responsibility to check this page periodically for changes. Your continued use of the website following the posting of modifications constitutes acceptance of those changes.
          </Typography>
        </>
      )
    },
    {
      title: 'User Accounts & Security',
      icon: <AccountCircleIcon />,
      content: (
        <>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>2. Accounts, Security & Responsibility</Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            To access certain features of the website, including checking out or viewing order histories, you may be required to register for an account. You agree to provide accurate, current, and complete information during registration.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            You are entirely responsible for maintaining the confidentiality of your account credentials (username and password) and for all activities that occur under your account. You agree to immediately notify GadgetHub of any unauthorized account activity or security breach.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            GadgetHub will not be liable for any losses or damages caused by any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent, harmful, or illegal activities.
          </Typography>
        </>
      )
    },
    {
      title: 'Products, Pricing & Payments',
      icon: <ShoppingBagIcon />,
      content: (
        <>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>3. Products, Pricing & Payment Terms</Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            We make every effort to display the colors, specifications, and descriptions of tech items as accurately as possible. However, we do not warrant that product descriptions or other site content are fully error-free, complete, or reliable.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            All prices are shown in USD and are subject to change without notice. Shipping fees and sales tax will be calculated and displayed at checkout where applicable. Free shipping offers are only valid for orders exceeding $50.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            By submitting an order, you authorize us to charge your selected payment method (Credit Card, Debit Card, PayPal, etc.). We reserve the right to refuse or cancel any order for reasons including stock limitations, product errors, pricing mistakes, or suspected fraudulent activity.
          </Typography>
        </>
      )
    },
    {
      title: 'Intellectual Property',
      icon: <SecurityIcon />,
      content: (
        <>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>4. Ownership and Intellectual Property</Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            The GadgetHub website, along with its original content, logos, layout designs, software, custom graphics, texts, icons, images, and videos are the exclusive property of GadgetHub and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            You are granted a limited, non-exclusive, non-transferable, and revocable license to access our platform for personal and shopping purposes only. You may not copy, modify, distribute, publish, reverse-engineer, or commercially exploit any material without prior written permission from GadgetHub.
          </Typography>
        </>
      )
    },
    {
      title: 'Limitation of Liability',
      icon: <HelpOutlineIcon />,
      content: (
        <>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>5. Limitation of Liability & Warranty</Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            GadgetHub is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations or warranties of any kind, express or implied, regarding the website operation, information accuracy, product availability, or shipping timelines.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            In no event shall GadgetHub, its directors, employees, partners, or suppliers be liable for any indirect, incidental, special, consequential, or punitive damages (including loss of profits, data, use, or goodwill) arising out of your access to or use of the website.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
            These limitations apply to the maximum extent permitted by applicable laws. Certain state laws do not allow limitations on implied warranties or exclusions of specific damages.
          </Typography>
        </>
      )
    }
  ];

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
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Terms & Conditions</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 400 }}>
            Last Updated: July 14, 2026. Please read these terms carefully before using our platform.
          </Typography>
        </Container>
      </Box>

      {/* Main content grid */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Sidebar Tabs */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 90 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ px: 2, pb: 2, fontWeight: 700 }} color="text.secondary">
                  TABLE OF CONTENTS
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Tabs
                  orientation="vertical"
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    borderRight: 0,
                    '& .MuiTab-root': {
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      py: 1.5,
                      px: 2,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        bgcolor: 'action.selected',
                        color: 'primary.main',
                        fontWeight: 700
                      }
                    },
                    '& .MuiTabs-indicator': {
                      left: 0,
                      width: 4,
                      borderRadius: 2
                    }
                  }}
                >
                  {SECTIONS.map((sec, idx) => (
                    <Tab
                      key={idx}
                      icon={sec.icon}
                      iconPosition="start"
                      label={sec.title}
                    />
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </Grid>

          {/* Details Content */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                {SECTIONS[activeTab].content}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Terms;
