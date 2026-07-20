import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, TextField,
  Button, Stack, Alert, CircularProgress, IconButton, Avatar
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!subject.trim()) {
      setError('Subject is required');
      return;
    }
    if (!message.trim()) {
      setError('Message is required');
      return;
    }

    setLoading(true);

    // Mock send request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000); // clear success alert after 5s
    }, 1500);
  };

  const CONTACT_INFO = [
    {
      icon: <PhoneIcon sx={{ fontSize: 28, color: '#2563EB' }} />,
      title: 'Call Support',
      details: '+1 (800) 555-0199',
      subtext: 'Toll-free, Mon-Fri 9am - 6pm EST'
    },
    {
      icon: <EmailIcon sx={{ fontSize: 28, color: '#06B6D4' }} />,
      title: 'Email Us',
      details: 'support@1% Battery.tech',
      subtext: 'We typically reply within 24 hours'
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 28, color: '#4CAF50' }} />,
      title: 'Visit Office',
      details: '100 Tech Plaza, Suite 400',
      subtext: 'Silicon Valley, CA 94025'
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 28, color: '#FF9800' }} />,
      title: 'Working Hours',
      details: 'Monday - Friday',
      subtext: '9:00 AM - 6:00 PM EST'
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
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Contact Us</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, opacity: 0.9 }}>
            Got questions, feedback, or need support? We're here to help you get the best out of your gadgets.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Info cards */}
          <Grid size={{ xs: 12, md: 5 }} >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Get In Touch
            </Typography>
            <Grid container spacing={2}>
              {CONTACT_INFO.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 12 }} key={index}>
                  <Card sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'action.hover', width: 52, height: 52 }}>
                      {item.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, my: 0.2 }}>
                        {item.details}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.subtext}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Social connection */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Connect with us on Social Media
              </Typography>
              <Stack direction="row" spacing={1.5}>
                {[FacebookIcon, TwitterIcon, InstagramIcon, YouTubeIcon].map((Icon, i) => (
                  <IconButton
                    key={i}
                    sx={{
                      bgcolor: 'action.hover',
                      color: 'text.secondary',
                      '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon />
                  </IconButton>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Form card */}
          <Grid size={{ xs: 12, md: 7 }} >
            <Card sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Send Us a Message
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Fill out the form below and our support team will get back to you shortly.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  ?? Your message has been sent successfully! We will get back to you soon.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }} >
                    <TextField
                      fullWidth
                      label="Your Name"
                      variant="outlined"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} >
                    <TextField
                      fullWidth
                      label="Email Address"
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} >
                    <TextField
                      fullWidth
                      label="Subject"
                      variant="outlined"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} >
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="How can we help?"
                      variant="outlined"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} >
                    <Button
                      size="large"
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      endIcon={!loading && <SendIcon />}
                      sx={{ px: 4, py: 1.2 }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
