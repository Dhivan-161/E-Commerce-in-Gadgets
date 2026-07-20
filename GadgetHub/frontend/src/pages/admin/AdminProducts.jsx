import React, { useState } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Button,
  Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Stack, FormControlLabel, Switch, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useProducts } from '../../contexts/ProductContext';
import { CATEGORIES } from '../../data/products';

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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleOpen = (product = null) => {
    if (product) {
      setForm({
        ...product,
        specs: product.specs.join(', ')
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      specs: form.specs.split(',').map(s => s.trim()).filter(s => s)
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }
    handleClose();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Products Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ borderRadius: 2 }}>
          Add Product
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={product.image} variant="rounded" sx={{ width: 48, height: 48 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={product.category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>
                    {product.inStock ? (
                      <Chip label="In Stock" size="small" color="success" sx={{ fontWeight: 600 }} />
                    ) : (
                      <Chip label="Out of Stock" size="small" color="error" sx={{ fontWeight: 600 }} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" size="small" onClick={() => handleOpen(product)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => handleDelete(product.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <TextField 
                label="Product Name" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                fullWidth 
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                  select 
                  label="Category" 
                  name="category" 
                  value={form.category} 
                  onChange={handleChange} 
                  fullWidth
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.label}</MenuItem>
                  ))}
                </TextField>
                <TextField 
                  label="Badge (e.g. New, Hot)" 
                  name="badge" 
                  value={form.badge} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                  label="Price ($)" 
                  name="price" 
                  type="number" 
                  value={form.price} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                />
                <TextField 
                  label="Original Price ($)" 
                  name="originalPrice" 
                  type="number" 
                  value={form.originalPrice} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Box>
              <TextField 
                label="Image URL" 
                name="image" 
                value={form.image} 
                onChange={handleChange} 
                required 
                fullWidth 
              />
              <TextField 
                label="Description" 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                multiline 
                rows={3} 
                required 
                fullWidth 
              />
              <TextField 
                label="Specifications (comma-separated)" 
                name="specs" 
                value={form.specs} 
                onChange={handleChange} 
                required 
                fullWidth 
                helperText="E.g. A17 Pro Chip, 48MP Camera, Titanium Frame"
              />
              <FormControlLabel 
                control={
                  <Switch 
                    name="inStock" 
                    checked={form.inStock} 
                    onChange={handleChange} 
                  />
                } 
                label="In Stock" 
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingId ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminProducts;
