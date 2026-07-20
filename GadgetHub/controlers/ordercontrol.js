const Order = require('../moduls/order');

const createOrder = async (req, res) => {
  try {
    const { items, shippingInfo, paymentInfo, tax, shipping, total } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);

    const newOrder = new Order({
      orderId,
      user: req.user ? req.user._id : null,
      items,
      shippingInfo,
      paymentInfo,
      tax,
      shipping,
      total
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getUserOrders
};
