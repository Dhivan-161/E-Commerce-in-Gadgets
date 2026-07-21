import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Button,
  Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Stack, FormControlLabel, Switch, MenuItem, Snackbar, Alert,
  InputAdornment, Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useProducts } from '../../contexts/ProductContext';
import { CATEGORIES } from '../../data/products';
import { request } from '../../services/api';



const initialForm = {
  name: '',
  category: 'Smartphones',
  price: '',
  originalPrice: '',
  rating: 5.0,
  reviews: 0,
  image: '',
  badge: '',
  description: '',
  inStock: true,
  specs: ''
};

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter(p => p.inStock).length;
    const outOfStock = total - inStock;
    return { total, inStock, outOfStock };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategoryFilter === 'all' || 
        product.category.toLowerCase() === selectedCategoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategoryFilter]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct(id);
        setSnackbar({ open: true, message: `Product "${name}" deleted successfully`, severity: 'info' });
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to delete product', severity: 'error' });
      }
    }
  };

  const handleOpen = (product = null) => {
    if (product) {
      setForm({
        ...product,
        specs: Array.isArray(product.specs) ? product.specs.join(', ') : (product.specs || '')
      });
      setEditingId(product.id);
    } else {
      setForm(initialForm);
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      setForm(prev => ({ ...prev, image: base64Url }));
      setSnackbar({ open: true, message: 'Image added successfully!', severity: 'success' });
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      setSnackbar({ open: true, message: 'Failed to read image', severity: 'error' });
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      rating: Number(form.rating) || 5.0,
      reviews: Number(form.reviews) || 0,
      specs: typeof form.specs === 'string' ? form.specs.split(',').map(s => s.trim()).filter(Boolean) : form.specs
    };

    try {
      if (editingId) {
        await updateProduct(editingId, productData);
        setSnackbar({ open: true, message: `Product "${form.name}" updated successfully!`, severity: 'success' });
      } else {
        await addProduct(productData);
        setSnackbar({ open: true, message: `New Product "${form.name}" added successfully!`, severity: 'success' });
      }
      handleClose();
    } catch (err) {
      setSnackbar({ open: true, message: 'Operation failed. Please try again.', severity: 'error' });
    }
  };

  return (
    <Box>
      {/* Header section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Products Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpen()} 
          sx={{ borderRadius: 2, px: 3, py: 1.2, fontWeight: 700, textTransform: 'none' }}
        >
          Add New Product
        </Button>
      </Box>

      {/* Summary KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              <CategoryIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Total Products
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {stats.total}
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper' }}>
            <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
              <CheckCircleIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                In Stock
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main' }}>
                {stats.inStock}
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper' }}>
            <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
              <CancelIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Out of Stock
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'error.main' }}>
                {stats.outOfStock}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Search controls */}
      <Card sx={{ borderRadius: 3, p: 2, mb: 3, boxShadow: 1 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            placeholder="Search products by name, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Filter Category"
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            sx={{ minWidth: 200 }}
            size="small"
          >
            <MenuItem value="all">All Categories</MenuItem>
            {CATEGORIES.filter(c => c.id !== 'all').map(c => (
              <MenuItem key={c.id} value={c.id}>{c.label}</MenuItem>
            ))}
          </TextField>
        </Stack>
      </Card>

      {/* Products Table */}
      <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Badge</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No products found matching your search criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          src={product.image} 
                          variant="rounded" 
                          sx={{ width: 48, height: 48, borderRadius: 2 }}
                        >
                          <ImageIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {product.name}
                          </Typography>
                          {product.specs && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {Array.isArray(product.specs) ? product.specs.slice(0, 2).join(' • ') : product.specs}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={product.category} size="small" variant="outlined" color="primary" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      ₹{product.price}
                      {product.originalPrice && (
                        <Typography component="span" variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', ml: 1 }}>
                          ₹{product.originalPrice}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.badge ? (
                        <Chip label={product.badge} size="small" color="secondary" sx={{ fontWeight: 600 }} />
                      ) : (
                        <Typography variant="caption" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.inStock ? (
                        <Chip label="In Stock" size="small" color="success" sx={{ fontWeight: 600 }} />
                      ) : (
                        <Chip label="Out of Stock" size="small" color="error" sx={{ fontWeight: 600 }} />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" size="small" onClick={() => handleOpen(product)} title="Edit product">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => handleDelete(product.id, product.name)} title="Delete product">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add / Edit Product Form Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem' }}>
            {editingId ? '✏️ Edit Product' : '➕ Add New Product to Store'}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField 
                    label="Product Name" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                    fullWidth 
                    placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    label="Price (₹)" 
                    name="price" 
                    type="number" 
                    value={form.price} 
                    onChange={handleChange} 
                    required 
                    fullWidth 
                    inputProps={{ min: 0, step: "0.01" }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    label="Original Price (₹)" 
                    name="originalPrice" 
                    type="number" 
                    value={form.originalPrice} 
                    onChange={handleChange} 
                    fullWidth 
                    helperText="Optional for discount display"
                    inputProps={{ min: 0, step: "0.01" }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    label="Badge Label" 
                    name="badge" 
                    value={form.badge} 
                    onChange={handleChange} 
                    fullWidth 
                    placeholder="e.g. Hot, New, Best Seller"
                  />
                </Grid>
              </Grid>

              {/* Image Input & Preview */}
              <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 2, bgcolor: 'action.hover' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Product Image
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 1, alignItems: 'flex-start' }}>
                      <Button
                        component="label"
                        variant="contained"
                        color="primary"
                        disabled={isUploading}
                        startIcon={<CloudUploadIcon />}
                        size="large"
                      >
                        {isUploading ? 'Uploading...' : 'Upload Local Image'}
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                      </Button>
                      
                      {form.image && (
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                          ✓ Image successfully added
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <TextField 
                label="Product Description" 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                multiline 
                rows={3} 
                required 
                fullWidth 
                placeholder="Describe key features, performance, and highlights of this product..."
              />

              <TextField 
                label="Specifications (comma-separated)" 
                name="specs" 
                value={form.specs} 
                onChange={handleChange} 
                required 
                fullWidth 
                helperText="E.g. Apple M3 Chip, 16GB RAM, 512GB SSD, Liquid Retina XDR"
              />

              <FormControlLabel 
                control={
                  <Switch 
                    name="inStock" 
                    checked={form.inStock} 
                    onChange={handleChange} 
                    color="success"
                  />
                } 
                label={
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    In Stock (Available for Purchase)
                  </Typography>
                } 
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ px: 4, borderRadius: 2, fontWeight: 700 }}>
              {editingId ? 'Save Changes' : 'Add Product to Store'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProducts;
