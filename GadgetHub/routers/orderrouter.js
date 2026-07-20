const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getUserOrders } = require('../controlers/ordercontrol');
const { protect, admin } = require('../middleware/auth');

router.post('/', (req, res, next) => {
  if (req.headers.authorization) {
    protect(req, res, next);
  } else {
    next();
  }
}, createOrder);

router.get('/', protect, admin, getOrders);
router.get('/myorders', protect, getUserOrders);

module.exports = router;
