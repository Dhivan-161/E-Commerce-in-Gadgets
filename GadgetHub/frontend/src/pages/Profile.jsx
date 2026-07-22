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
  Fade
} from '@mui/material';
import {
  PhotoCamera,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile, uploadImage } from '../services/api';

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#3B82F6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e5eaf5 100%)',
      py: { xs: 4, md: 8 },
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Elements */}
      <Box sx={{
        position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%', zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%', zIndex: 0
      }} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={800}>
          <Paper elevation={0} sx={{
            overflow: 'hidden',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.6)'
          }}>
            {/* Header / Cover Area */}
            <Box sx={{
              height: '180px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              position: 'relative'
            }}>
              <Box sx={{
                position: 'absolute',
                bottom: '-60px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center'
              }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={imagePreview || undefined}
                    sx={{
                      width: 130,
                      height: 130,
                      border: '4px solid white',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      bgcolor: '#1E3A8A',
                      fontSize: '3.5rem',
                      fontWeight: 700
                    }}
                  >
                    {(!imagePreview && formData.name) ? formData.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                  <IconButton
                    color="primary"
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      '&:hover': { background: '#f8f9fa' }
                    }}
                  >
                    <PhotoCamera fontSize="small" />
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Content Area */}
            <Box sx={{ pt: 10, pb: 6, px: { xs: 3, md: 8 } }}>
              <Typography variant="h4" fontWeight="800" textAlign="center" color="#1e293b" gutterBottom>
                {formData.name || 'Your Profile'}
              </Typography>
              <Typography variant="body1" textAlign="center" color="text.secondary" mb={5}>
                Manage your personal information and security settings.
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 4, borderRadius: '12px' }}>{success}</Alert>}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" fontWeight="700" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Personal Info
                    </Typography>
                    
                    <TextField
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.6)' }
                      }}
                    />
                    
                    <TextField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.6)' }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" fontWeight="700" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Security
                    </Typography>

                    <TextField
                      label="New Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      placeholder="Leave blank to keep current"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.6)' }
                      }}
                    />

                    <TextField
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKeyIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.6)' }
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{
                      py: 1.5,
                      px: 5,
                      borderRadius: '50px',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                      boxShadow: '0 10px 20px rgba(59,130,246,0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 25px rgba(59,130,246,0.4)',
                        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                      }
                    }}
                  >
                    {saving ? 'Saving Changes...' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Profile;
