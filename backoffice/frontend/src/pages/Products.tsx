import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  Edit,
  Delete,
  Add
} from '@mui/icons-material';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  nameTR?: string;
  price: number;
  category: string;
  categoryTR?: string;
  inStock: boolean;
  stock: number;
  rating: number;
  reviews: number;
  isOrganic: boolean;
  isFeatured: boolean;
  createdAt: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameTR: '',
    price: '',
    category: '',
    categoryTR: '',
    stock: '',
    inStock: true
  });

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      // Mock data for now
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Organic Tomatoes',
          nameTR: 'Organik Domatesler',
          price: 25.99,
          category: 'Vegetables',
          categoryTR: 'Sebzeler',
          inStock: true,
          stock: 100,
          rating: 4.8,
          reviews: 124,
          isOrganic: true,
          isFeatured: true,
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'Fresh Apples',
          nameTR: 'Taze Elmalar',
          price: 18.50,
          category: 'Fruits',
          categoryTR: 'Meyveler',
          inStock: true,
          stock: 150,
          rating: 4.6,
          reviews: 89,
          isOrganic: true,
          isFeatured: true,
          createdAt: '2024-01-14'
        }
      ];
      
      setProducts(mockProducts);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameTR: product.nameTR || '',
      price: product.price.toString(),
      category: product.category,
      categoryTR: product.categoryTR || '',
      stock: product.stock.toString(),
      inStock: product.inStock
    });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      nameTR: '',
      price: '',
      category: '',
      categoryTR: '',
      stock: '',
      inStock: true
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      // Mock save operation
      console.log('Saving product:', formData);
      setDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Mock delete operation
        console.log('Deleting product:', id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Product
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {product.name}
                      </Typography>
                      {product.nameTR && (
                        <Typography variant="caption" color="textSecondary">
                          {product.nameTR}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {product.category}
                      </Typography>
                      {product.categoryTR && (
                        <Typography variant="caption" color="textSecondary">
                          {product.categoryTR}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>₺{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.inStock ? 'In Stock' : 'Out of Stock'}
                      color={product.inStock ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        ⭐ {product.rating}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ({product.reviews} reviews)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name (Turkish)"
                value={formData.nameTR}
                onChange={(e) => setFormData({ ...formData, nameTR: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category (Turkish)"
                value={formData.categoryTR}
                onChange={(e) => setFormData({ ...formData, categoryTR: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;