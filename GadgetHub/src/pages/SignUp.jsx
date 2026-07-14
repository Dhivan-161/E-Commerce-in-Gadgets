import React, { useState } from 'react';
import {
  Box, Container, Typography, TextField, Button, Card, CardContent,
  Checkbox, FormControlLabel, Link as MuiLink, Stack, Alert,
  InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useAuth } from '../contexts/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

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
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms and Conditions');
      return;
    }

    setLoading(true);

    signup(name, email, password)
      .then(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          navigate('/signin');
        }, 1500);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || 'Failed to register');
      });
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        background: (theme) => theme.palette.mode === 'dark'
          ? 'radial-gradient(circle at 10% 20%, rgba(255, 101, 132, 0.08) 0%, rgba(10, 10, 15, 1) 90%)'
          : 'radial-gradient(circle at 10% 20%, rgba(255, 101, 132, 0.04) 0%, rgba(248, 249, 255, 1) 90%)',
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
              background: 'linear-gradient(135deg, #FF6584 0%, #6C63FF 100%)',
              borderRadius: 'inherit',
              zIndex: -1,
              opacity: 0.5,
            }
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 5 } }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join GadgetHub to discover and shop the latest tech
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Registration successful! Redirecting to sign in...
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading || success}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

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

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || success}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleToggleConfirmPassword} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      disabled={loading || success}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      I agree to the{' '}
                      <MuiLink
                        component={RouterLink}
                        to="/terms"
                        sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                      >
                        Terms and Conditions
                      </MuiLink>
                    </Typography>
                  }
                />

                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={loading || success}
                  sx={{ py: 1.5, fontSize: '1rem', background: 'linear-gradient(135deg, #FF6584 0%, #6C63FF 100%)' }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                </Button>
              </Stack>
            </form>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <MuiLink
                  component={RouterLink}
                  to="/signin"
                  sx={{ fontWeight: 700, textDecoration: 'none', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                >
                  Sign In
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SignUp;
