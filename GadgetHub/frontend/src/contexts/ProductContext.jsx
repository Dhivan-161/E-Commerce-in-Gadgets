import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getProducts as apiGetProducts, 
  createProduct as apiCreateProduct, 
  updateProduct as apiUpdateProduct, 
  deleteProduct as apiDeleteProduct 
} from '../services/api';

import { PRODUCTS } from '../data/products';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(PRODUCTS);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiGetProducts();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(PRODUCTS);
      }
    } catch (error) {
      console.error('Failed to fetch products from backend, using default products:', error);
      setProducts(PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (newProduct) => {
    try {
      const savedProduct = await apiCreateProduct(newProduct);
      setProducts((prev) => [...prev, savedProduct]);
      return savedProduct;
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const savedProduct = await apiUpdateProduct(id, updatedFields);
      setProducts((prev) => prev.map((p) => (p.id === id ? savedProduct : p)));
      return savedProduct;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiDeleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  };

  const value = {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {!loading && children}
    </ProductContext.Provider>
  );
};
