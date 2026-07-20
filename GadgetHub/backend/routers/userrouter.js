const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, getUserProfile, updateUserProfile } = require('../controlers/usercontrol');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin-only route to list users
router.get('/', protect, admin, getUsers);

module.exports = router;
