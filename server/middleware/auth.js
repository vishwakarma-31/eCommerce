const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - check if user is authenticated
 * Extracts JWT token from Authorization header and verifies it
 * Adds user object to request if valid
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} 401 error if not authenticated
 */
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Restrict to specific roles
 * Creates middleware that checks if user has one of the specified roles
 * @param {...string} roles - Roles that are allowed to access the route
 * @returns {Function} Middleware function
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Specific role middleware (matching the capitalized roles in the User model)
const isBacker = restrictTo('Backer', 'Creator', 'Admin');
const isCreator = restrictTo('Creator', 'Admin');
const isAdmin = restrictTo('Admin');

module.exports = {
  protect,
  restrictTo,
  isBacker,
  isCreator,
  isAdmin
};