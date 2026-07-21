import React from 'react';
import {
  Box, Container, Typography, Paper, Grid, TextField, Button, Divider
} from '@mui/material';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import SaveIcon from '@mui/icons-material/Save';

const Setup = () => {
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <SettingsSuggestIcon sx={{ fontSize: 40 }} />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>System Setup</Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Configure your preferences and system settings here.
          </Typography>
        </Container>
      </Box>

      {/* Setup Form */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            General Configuration
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Store Name" 
                variant="outlined" 
                defaultValue="GadgetHub"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Support Email" 
                variant="outlined" 
                defaultValue="support@gadgethub.com"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Store Description" 
                variant="outlined" 
                multiline
                rows={4}
                defaultValue="The best place to find all your electronic gadgets."
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 5, textAlign: 'right' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              startIcon={<SaveIcon />}
              sx={{ fontWeight: 600, px: 4 }}
            >
              Save Settings
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Setup;
