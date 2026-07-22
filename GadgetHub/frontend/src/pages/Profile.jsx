import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Grid,
  InputAdornment,
  Fade,
  Divider
} from '@mui/material';
import {
  PhotoCamera,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  VpnKey as VpnKeyIcon,
  Security as SecurityIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile, uploadImage } from '../services/api';

const CustomLabel = ({ children }) => (
  <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#374151', mb: '8px', display: 'block' }}>
    {children}
  </Typography>
);

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setFormData((prev) => ({
          ...prev,
          name: data.name || '',
          email: data.email || '',
          profileImage: data.profileImage || '',
        }));
        setImagePreview(data.profileImage || null);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setSaving(false);
      return;
    }

    try {
      let imageUrl = formData.profileImage;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const updateData = {
        name: formData.name,
        email: formData.email,
        profileImage: imageUrl,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      await updateUserProfile(updateData);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      height: '56px',
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      color: '#111827',
      transition: 'all 0.2s ease-in-out',
      '& fieldset': {
        borderColor: '#E5E7EB',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: '#D1D5DB',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563EB',
        borderWidth: '1px',
        boxShadow: '0 0 0 4px rgba(37,99,235,0.15)',
      },
    },
    '& input::placeholder': {
      color: '#9CA3AF',
      opacity: 1,
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#2563EB' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 8 }}>
      {/* Header Gradient */}
      <Box
        sx={{
          height: '180px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.5,
          },
          backdropFilter: 'blur(10px)',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', px: { xs: 2, sm: 3, md: 4 } }}>
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              mt: '-40px',
              borderRadius: '20px',
              bgcolor: '#FFFFFF',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
              p: { xs: 3, md: '40px' },
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            {/* Avatar Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '-80px', mb: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={imagePreview || undefined}
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid #FFFFFF',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    bgcolor: '#2563EB',
                    fontSize: '3rem',
                    fontWeight: 700,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  {(!imagePreview && formData.name) ? formData.name.charAt(0).toUpperCase() : 'A'}
                </Avatar>
                <IconButton
                  color="primary"
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    right: -10,
                    width: 36,
                    height: 36,
                    background: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease',
                    border: '1px solid #F3F4F6',
                    '&:hover': { 
                      background: '#F9FAFB',
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <PhotoCamera sx={{ fontSize: 20, color: '#2563EB' }} />
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </IconButton>
              </Box>

              <Typography variant="h5" fontWeight="800" color="#111827" sx={{ mt: 2, mb: 0.5 }}>
                {formData.name || (currentUser?.isAdmin ? 'Admin' : 'User')}
              </Typography>
              <Typography variant="body2" color="#6B7280" fontWeight="500">
                {currentUser?.isAdmin ? 'Administrator' : 'Member'} • Joined 2026
              </Typography>
              <Typography variant="body2" color="#9CA3AF" sx={{ mt: 1 }}>
                Manage your personal information and account security.
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 4, borderRadius: '12px' }}>{success}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              
              {/* Section 1: Personal Information */}
              <Box sx={{ mb: '40px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BadgeIcon sx={{ color: '#2563EB', mr: 1.5 }} />
                  <Typography variant="h6" fontWeight="700" color="#111827">
                    Personal Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: '32px' }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: '24px' }}>
                      <CustomLabel>Full Name</CustomLabel>
                      <TextField
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        placeholder="Enter your full name"
                        sx={textFieldSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: '#2563EB' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: '24px' }}>
                      <CustomLabel>Email Address</CustomLabel>
                      <TextField
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                        placeholder="admin@example.com"
                        sx={textFieldSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: '#2563EB' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Section 2: Security */}
              <Box sx={{ mb: '40px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon sx={{ color: '#2563EB', mr: 1.5 }} />
                  <Typography variant="h6" fontWeight="700" color="#111827">
                    Security
                  </Typography>
                </Box>
                <Divider sx={{ mb: '32px' }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: '24px' }}>
                      <CustomLabel>New Password</CustomLabel>
                      <TextField
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        placeholder="Leave blank to keep current"
                        sx={textFieldSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: '#2563EB' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: '24px' }}>
                      <CustomLabel>Confirm New Password</CustomLabel>
                      <TextField
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        fullWidth
                        placeholder="Confirm your new password"
                        sx={textFieldSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <VpnKeyIcon sx={{ color: '#2563EB' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => window.history.back()}
                  sx={{
                    height: '50px',
                    px: 4,
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 600,
                    textTransform: 'none',
                    color: '#6B7280',
                    borderColor: '#E5E7EB',
                    bgcolor: '#FFFFFF',
                    '&:hover': {
                      bgcolor: '#F9FAFB',
                      borderColor: '#D1D5DB',
                    }
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{
                    height: '50px',
                    px: 4,
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(37,99,235,0.3)',
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
                    }
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>

            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Profile;
