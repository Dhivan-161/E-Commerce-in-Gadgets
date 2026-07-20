const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controlers/admincontrol');
const { protect, admin } = require('../middleware/auth');

router.get('/dashboard', protect, admin, getDashboardStats);

module.exports = router;
