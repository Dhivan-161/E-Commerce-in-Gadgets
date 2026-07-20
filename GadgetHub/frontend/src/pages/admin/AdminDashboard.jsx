import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Avatar, 
  List, ListItem, ListItemAvatar, ListItemText, Divider, CircularProgress, Alert
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip
} from 'recharts';
import { getDashboardData } from '../../services/api';

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2 }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, width: 48, height: 48 }}>
          {icon}
        </Avatar>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
        <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
          {trend}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          vs last month
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message || 'Failed to fetch dashboard stats');
        setLoading(false);
      });
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingBagIcon />;
      case 'user': return <PersonAddIcon />;
      case 'shipment': return <LocalShippingIcon />;
      case 'success': return <CheckCircleIcon />;
      default: return <ShoppingBagIcon />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const revenue = data?.totalRevenue !== undefined ? `₹${data.totalRevenue.toLocaleString()}` : '₹0';
  const ordersCount = data?.totalOrders !== undefined ? data.totalOrders : 0;
  const usersCount = data?.totalUsers !== undefined ? data.totalUsers : 0;
  const conversionRate = data?.conversionRate !== undefined ? `${data.conversionRate}%` : '0.00%';
  const chartData = data?.chartData || [];
  const activity = data?.activity || [];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Dashboard Overview
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} >
          <StatCard 
            title="Total Revenue" 
            value={revenue} 
            icon={<AttachMoneyIcon />} 
            color="success" 
            trend="+20.1%" 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} >
          <StatCard 
            title="Total Orders" 
            value={ordersCount} 
            icon={<ShoppingBagIcon />} 
            color="primary" 
            trend="+12.5%" 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} >
          <StatCard 
            title="Active Users" 
            value={usersCount} 
            icon={<PeopleAltIcon />} 
            color="info" 
            trend="+5.2%" 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} >
          <StatCard 
            title="Conversion Rate" 
            value={conversionRate} 
            icon={<TrendingUpIcon />} 
            color="warning" 
            trend="+1.2%" 
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }} >
          <Card sx={{ height: 420, borderRadius: 3, boxShadow: 2, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Revenue Overview
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, lg: 4 }} >
          <Card sx={{ height: 420, borderRadius: 3, boxShadow: 2, p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Recent Activity
            </Typography>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              {activity.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  No recent activities
                </Typography>
              ) : (
                <List disablePadding>
                  {activity.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 36, height: 36 }}>
                            {getActivityIcon(item.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.text}
                          secondary={item.time}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                      {index < activity.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;


