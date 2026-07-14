import React from 'react';
import {
  Box, Container, Typography, Grid, Card, Avatar, Stack, Button, Divider,
} from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PublicIcon from '@mui/icons-material/Public';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const STATS = [
  { icon: <GroupsIcon fontSize="large" />, value: '50,000+', label: 'Happy Customers' },
  { icon: <FlashOnIcon fontSize="large" />, value: '500+', label: 'Products' },
  { icon: <EmojiEventsIcon fontSize="large" />, value: '15+', label: 'Awards Won' },
  { icon: <PublicIcon fontSize="large" />, value: '30+', label: 'Countries Served' },
];

const TEAM = [
  { name: 'Irfan', role: 'CEO & Founder', avatar: 'A', color: '#6C63FF' },
  { name: 'Hashina', role: 'Head of Products', avatar: 'S', color: '#FF6584' },
  { name: 'Bismi', role: 'Lead Engineer', avatar: 'M', color: '#4CAF50' },
  { name: 'Afrin', role: 'Customer Success', avatar: 'P', color: '#FF9800' },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>About GadgetHub</Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
            We're a team of passionate tech enthusiasts dedicated to bringing you the latest and greatest gadgets at the most competitive prices.
          </Typography>
        </Container>
      </Box>

      {/* Stats */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {STATS.map((stat) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mission */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Our Mission</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, fontSize: '1.1rem' }}>
          At GadgetHub, we believe everyone deserves access to the best technology. That's why we work directly with leading manufacturers to bring you authentic products at fair prices. From flagship smartphones to premium audio gear — we've got you covered.
        </Typography>
        <Divider sx={{ my: 4 }} />
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, fontSize: '1.1rem' }}>
          Founded in 2020, we've grown from a small team of three to a global company serving customers in over 30 countries. Our commitment to quality, authenticity, and exceptional customer service has made us one of the most trusted gadget retailers online.
        </Typography>
      </Container>

      {/* Team */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', mb: 1 }}>Meet Our Team</Typography>
          <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>The people behind GadgetHub</Typography>
          <Grid container spacing={3} justifyContent="center">
            {TEAM.map((member) => (
              <Grid item xs={12} sm={6} md={3} key={member.name}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ bgcolor: member.color, width: 72, height: 72, mx: 'auto', mb: 2, fontSize: '1.8rem', fontWeight: 700 }}>
                    {member.avatar}
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{member.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{member.role}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Container maxWidth="sm">
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Ready to Shop?</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Discover our full range of premium gadgets and electronics.</Typography>
          <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
