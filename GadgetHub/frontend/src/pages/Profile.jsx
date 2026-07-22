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
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile, uploadImage } from '../services/api';

const Profile = () => {
  const { currentUser, login } = useAuth(); // using login to update context might not work if it requires token, but we can just update the local state. Actually AuthContext should provide a way to update user. Wait, we can just fetch and show.
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

      const res = await updateUserProfile(updateData);
      setSuccess('Profile updated successfully!');
      
      // Update local storage or AuthContext if possible.
      // Easiest is to reload the window to update the navbar, or let AuthContext handle it if it syncs.
      // We will just reload after 1.5 seconds.
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="700" mb={4} textAlign="center">
          My Profile
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={imagePreview || undefined}
              sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '2.5rem' }}
            >
              {(!imagePreview && formData.name) ? formData.name[0].toUpperCase() : 'U'}
            </Avatar>
            <Button variant="outlined" component="label">
              Upload New Image
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Box>

          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          
          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />

          <Typography variant="subtitle1" fontWeight="600" sx={{ mt: 2 }}>
            Change Password (Optional)
          </Typography>

          <TextField
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={saving}
            sx={{ mt: 2 }}
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
