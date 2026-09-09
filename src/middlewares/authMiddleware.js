const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 1. Protect routes (Ensures user is logged in)
exports.protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    // Verify Token (Make sure to add JWT_SECRET to your backend .env file!)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key_123');

    // Attach the user to the request object
    req.user = await User.findByPk(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// 2. Authorize roles (Ensures user has correct permissions)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};

