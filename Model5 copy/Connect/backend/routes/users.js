const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

// GET /api/users/profile - Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/profile - Update user profile details
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, contact, dob } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (contact) user.contact = contact;
    if (dob) user.dob = dob;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
