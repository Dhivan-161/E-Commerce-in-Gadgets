import React, { useState } from 'react';
import {
  Box, Container, Typography, TextField, Button, Card, CardContent,
  Checkbox, FormControlLabel, Link as MuiLink, Divider, Stack, Alert,
  InputAdornment, IconButton, CircularProgress, Grid
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import { useAuth } from '../contexts/AuthContext';
const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const handleTogglePassword = () => setShowPassword(!showPassword);
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
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);

    login(email, password)
      .then(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || 'Failed to log in');
      });
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        background: 'transparent',
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
              background: 'linear-gradient(135deg, #2563EB 0%, #F97316 100%)',
              borderRadius: 'inherit',
              zIndex: -1,
              opacity: 0.5,
            }
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 5 } }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your credentials to access your GadgetHub account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Login successful! Redirecting to home...
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || success}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || success}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked color="primary" />}
                    label={<Typography variant="body2" color="text.secondary">Remember me</Typography>}
                  />
                  <MuiLink
                    component={RouterLink}
                    to="/forget"
                    variant="body2"
                    sx={{ fontWeight: 600, textDecoration: 'none', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Forgot Password?
                  </MuiLink>
                </Box>

                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={loading || success}
                  sx={{ py: 1.5, fontSize: '1rem' }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="text.secondary">or continue with</Typography>
            </Divider>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }} >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={() => {
                    setLoading(true);
                    login('user@example.com', 'password123')
                      .then(() => {
                        setLoading(false);
                        setSuccess(true);
                        setTimeout(() => navigate('/'), 1500);
                      })
                      .catch((err) => {
                        setLoading(false);
                        setError(err.message);
                      });
                  }}
                  sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' } }}
                >
                  Google
                </Button>
              </Grid>
              <Grid size={{ xs: 6 }} >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AppleIcon />}
                  onClick={() => {
                    setLoading(true);
                    login('user@example.com', 'password123')
                      .then(() => {
                        setLoading(false);
                        setSuccess(true);
                        setTimeout(() => navigate('/'), 1500);
                      })
                      .catch((err) => {
                        setLoading(false);
                        setError(err.message);
                      });
                  }}
                  sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' } }}
                >
                  Apple
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <MuiLink
                  component={RouterLink}
                  to="/signup"
                  sx={{ fontWeight: 700, textDecoration: 'none', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                >
                  Sign Up
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
export default SignIn;
