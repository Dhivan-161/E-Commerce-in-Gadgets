import React, { useState, useMemo } from 'react';
import {
  Box, Container, Typography, Grid, TextField, InputAdornment,
  Stack, Select, MenuItem, FormControl, InputLabel,
  Slider, Divider, Drawer, Button, IconButton,
  useMediaQuery, useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/products';
import { useProducts } from '../contexts/ProductContext';
import { formatPrice } from '../utils/currency';

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A–Z' },
];

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { products } = useProducts();

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [products, search, category, sortBy, priceRange]);

  const FilterPanel = () => (
    <Box sx={{ p: isMobile ? 2 : 0 }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Filters</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>
      )}

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
        Category
      </Typography>
      <Stack spacing={1.5} sx={{ mb: 4 }}>
        {CATEGORIES.map((cat) => (
          <Box
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              pl: 2,
              py: 1.5,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 250ms ease',
              fontWeight: 500,
              background: category === cat.id 
                ? 'linear-gradient(to right, #3B82F6, #2563EB)' 
                : 'transparent',
              color: category === cat.id ? 'white' : 'text.primary',
              boxShadow: category === cat.id 
                ? '0 4px 14px 0 rgba(59,130,246,0.39)' 
                : 'none',
              border: '1px solid',
              borderColor: category === cat.id ? 'transparent' : 'divider',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: category === cat.id ? 'transparent' : 'primary.main',
                bgcolor: category !== cat.id ? 'action.hover' : 'transparent'
              }
            }}
          >
            {cat.label}
          </Box>
        ))}
      </Stack>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
        Price Range
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
        {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}
      </Typography>
      <Slider
        value={priceRange}
        onChange={(_, v) => setPriceRange(v)}
        min={0}
        max={200000}
        step={5000}
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => formatPrice(v)}
        sx={{
          color: '#3B82F6',
          '& .MuiSlider-thumb': {
            transition: 'all 250ms ease',
            '&:hover, &.Mui-active': {
              boxShadow: '0 0 0 8px rgba(59, 130, 246, 0.16)',
            },
          },
        }}
      />

      {isMobile && (
        <Button fullWidth variant="contained" sx={{ mt: 4, py: 1.5, borderRadius: '12px', fontWeight: 600 }} onClick={() => setDrawerOpen(false)}>
          Apply Filters
        </Button>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>All Products</Typography>
        <Typography color="text.secondary">{filtered.length} products found</Typography>
      </Box>

      {/* Search + Sort bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {isMobile && (
          <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setDrawerOpen(true)}>
            Filters
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Sidebar */}
        {!isMobile && (
          <Grid size={{ md: 3 }} >
            <Box sx={{ position: 'sticky', top: 80, p: 3, bgcolor: 'background.paper', backdropFilter: 'blur(16px)', borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <FilterPanel />
            </Box>
          </Grid>
        )}

        {/* Product grid */}
        <Grid size={{ xs: 12, md: 9 }} >
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>No products found 😔</Typography>
              <Typography color="text.secondary">Try adjusting your search or filters</Typography>
              <Button variant="outlined" sx={{ mt: 3, borderRadius: '12px' }} onClick={() => { setSearch(''); setCategory('all'); setPriceRange([0, 200000]); }}>
                Clear Filters
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filtered.map((product) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Mobile filter drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, pt: 2 }}>
          <FilterPanel />
        </Box>
      </Drawer>
    </Container>
  );
};

export default Products;
