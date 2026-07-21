const Product = require('../moduls/product');
const { defaultProducts } = require('../seedProducts');
const mongoose = require('mongoose');

// In-memory fallback array if MongoDB is unavailable
let memoryProducts = [...defaultProducts];

const isDbConnected = () => mongoose.connection.readyState === 1;

const getProducts = async (req, res) => {
  try {
    if (isDbConnected()) {
      const products = await Product.find({});
      return res.json(products);
    } else {
      return res.json(memoryProducts);
    }
  } catch (error) {
    console.warn('MongoDB error in getProducts, serving memory products:', error.message);
    return res.json(memoryProducts);
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (isDbConnected()) {
      const product = await Product.findOne({ id: productId });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    } else {
      const product = memoryProducts.find(p => p.id === productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    }
  } catch (error) {
    console.warn('MongoDB error in getProductById, serving memory product fallback:', error.message);
    const product = memoryProducts.find(p => p.id === Number(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, price, originalPrice, badge, description, inStock, specs, image, rating, reviews } = req.body;
    
    const newProductData = {
      id: Date.now(),
      name,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      badge: badge || null,
      description,
      inStock: inStock !== undefined ? inStock : true,
      specs: Array.isArray(specs) ? specs : [],
      image: image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
      rating: rating || 5.0,
      reviews: reviews || 0,
    };

    if (isDbConnected()) {
      const newProduct = new Product(newProductData);
      const saved = await newProduct.save();
      return res.status(201).json(saved);
    } else {
      memoryProducts.unshift(newProductData);
      return res.status(201).json(newProductData);
    }
  } catch (error) {
    console.warn('MongoDB error in createProduct, saving to memory fallback:', error.message);
    const newProductData = { ...req.body, id: Date.now() };
    memoryProducts.unshift(newProductData);
    return res.status(201).json(newProductData);
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (isDbConnected()) {
      const product = await Product.findOne({ id: productId });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      const { name, category, price, originalPrice, badge, description, inStock, specs, image, rating, reviews } = req.body;

      if (name !== undefined) product.name = name;
      if (category !== undefined) product.category = category;
      if (price !== undefined) product.price = price;
      if (originalPrice !== undefined) product.originalPrice = originalPrice;
      if (badge !== undefined) product.badge = badge;
      if (description !== undefined) product.description = description;
      if (inStock !== undefined) product.inStock = inStock;
      if (specs !== undefined) product.specs = specs;
      if (image !== undefined) product.image = image;
      if (rating !== undefined) product.rating = rating;
      if (reviews !== undefined) product.reviews = reviews;

      const saved = await product.save();
      return res.json(saved);
    } else {
      const index = memoryProducts.findIndex(p => p.id === productId);
      if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }
      memoryProducts[index] = { ...memoryProducts[index], ...req.body };
      return res.json(memoryProducts[index]);
    }
  } catch (error) {
    console.warn('MongoDB error in updateProduct, updating memory fallback:', error.message);
    const productId = Number(req.params.id);
    const index = memoryProducts.findIndex(p => p.id === productId);
    if (index !== -1) {
      memoryProducts[index] = { ...memoryProducts[index], ...req.body };
      return res.json(memoryProducts[index]);
    }
    return res.status(404).json({ message: 'Product not found' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (isDbConnected()) {
      const deleted = await Product.findOneAndDelete({ id: productId });
      if (!deleted) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json({ message: 'Product deleted successfully' });
    } else {
      memoryProducts = memoryProducts.filter(p => p.id !== productId);
      return res.json({ message: 'Product deleted successfully' });
    }
  } catch (error) {
    console.warn('MongoDB error in deleteProduct, deleting from memory fallback:', error.message);
    const productId = Number(req.params.id);
    memoryProducts = memoryProducts.filter(p => p.id !== productId);
    return res.json({ message: 'Product deleted successfully' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
