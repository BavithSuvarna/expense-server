const express = require('express');
const { signup, login } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// ✅ Signup and Login
router.post('/signup', signup);
router.post('/login', login);

// ✅ New route to get current user's profile (username)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('username');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
