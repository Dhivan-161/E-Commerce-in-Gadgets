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
      console.info('Backend API offline or database disconnected. Using built-in product catalog.');
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
      setProducts((prev) => [savedProduct, ...prev]);
      return savedProduct;
    } catch (error) {
      console.warn('Backend API unavailable, adding product to local state:', error);
      const fallbackProduct = {
        ...newProduct,
        id: Date.now(),
      };
      setProducts((prev) => [fallbackProduct, ...prev]);
      return fallbackProduct;
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const savedProduct = await apiUpdateProduct(id, updatedFields);
      setProducts((prev) => prev.map((p) => (p.id === id ? savedProduct : p)));
      return savedProduct;
    } catch (error) {
      console.warn('Backend API unavailable, updating product in local state:', error);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
      return { id, ...updatedFields };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiDeleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.warn('Backend API unavailable, deleting product from local state:', error);
      setProducts((prev) => prev.filter((p) => p.id !== id));
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
