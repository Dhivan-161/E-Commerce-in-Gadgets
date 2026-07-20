const Product = require('../moduls/product');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, price, originalPrice, badge, description, inStock, specs, image, rating, reviews } = req.body;
    const newProduct = new Product({
      name,
      category,
      price,
      originalPrice: originalPrice || null,
      badge: badge || null,
      description,
      inStock: inStock !== undefined ? inStock : true,
      specs: Array.isArray(specs) ? specs : [],
      image: image || '',
      rating: rating || 5.0,
      reviews: reviews || 0,
    });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const { name, category, price, originalPrice, badge, description, inStock, specs, image, rating, reviews } = req.body;

    product.name = name !== undefined ? name : product.name;
    product.category = category !== undefined ? category : product.category;
    product.price = price !== undefined ? price : product.price;
    product.originalPrice = originalPrice !== undefined ? originalPrice : product.originalPrice;
    product.badge = badge !== undefined ? badge : product.badge;
    product.description = description !== undefined ? description : product.description;
    product.inStock = inStock !== undefined ? inStock : product.inStock;
    product.specs = specs !== undefined ? specs : product.specs;
    product.image = image !== undefined ? image : product.image;
    product.rating = rating !== undefined ? rating : product.rating;
    product.reviews = reviews !== undefined ? reviews : product.reviews;

    const saved = await product.save();
    res.json(saved);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: Number(req.params.id) });
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
