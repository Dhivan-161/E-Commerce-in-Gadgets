import React, { useState } from 'react';
import {
  Box, Container, Typography, TextField, Button, Card, CardContent,
  Stack, Alert, InputAdornment, CircularProgress, Link as MuiLink
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    // Mock Forgot Password Reset link trigger
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        background: (theme) => theme.palette.mode === 'dark'
          ? 'radial-gradient(circle at 10% 20%, rgba(108, 99, 255, 0.08) 0%, rgba(10, 10, 15, 1) 90%)'
          : 'radial-gradient(circle at 10% 20%, rgba(108, 99, 255, 0.04) 0%, rgba(248, 249, 255, 1) 90%)',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            overflow: 'visible',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
              borderRadius: 'inherit',
              zIndex: -1,
              opacity: 0.5,
            }
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 5 } }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <MuiLink
                component={RouterLink}
                to="/signin"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Back to Sign In</Typography>
              </MuiLink>
            </Box>

            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Forgot Password?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No worries! Enter your email and we'll send you instructions to reset your password.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2, textAlign: 'left' }}>
                  A password reset link has been sent to <strong>{email}</strong>. Please check your inbox.
                </Alert>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/signin')}
                  sx={{ mt: 1 }}
                >
                  Return to Sign In
                </Button>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ py: 1.5, fontSize: '1rem' }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                  </Button>
                </Stack>
              </form>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
