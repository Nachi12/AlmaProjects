const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Main authentication middleware (required)
const authenticate = async (req, res, next) => {
  console.log('\n🔐 ===== AUTH MIDDLEWARE CALLED =====');
  console.log('📍 Path:', req.path);
  console.log('🔑 Authorization header:', req.headers.authorization);

  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');

    if (!token) {
      console.log('❌ AUTH FAILED: No token provided');
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    console.log('✅ Token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded, userId:', decoded.userId);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      console.log('❌ AUTH FAILED: User not found');
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      console.log('❌ AUTH FAILED: Account deactivated');
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    console.log('✅ AUTH SUCCESS: User authenticated');
    req.user = user;
    req.userId = user._id;
    console.log('🎯 Calling next() to proceed to route handler...');
    next();
  } catch (error) {
    console.error('❌ AUTH ERROR:', error.message);
    const code = error.name === 'TokenExpiredError' ? 401 : 500;
    res.status(code).json({
      success: false,
      message: error.message
    });
  }
};

// Optional authentication middleware (doesn't require token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id;
      }
    }
    
    // Always proceed to next middleware
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Admin authorization middleware
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Export all three middleware functions
module.exports = { authenticate, optionalAuth, isAdmin };
