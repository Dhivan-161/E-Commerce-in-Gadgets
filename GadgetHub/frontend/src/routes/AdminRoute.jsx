import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const AdminRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Check if user exists and has the isAdmin flag
  if (!currentUser || !currentUser.isAdmin) {
    // Redirect them to the home page or a specific "unauthorized" page
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
