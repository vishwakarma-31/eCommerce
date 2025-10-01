/**
 * Improved Auth Controller with better error handling and code quality standards
 * This is an example of how controllers should be structured following the code quality standards
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const {
  CustomError,
  ValidationError,
  AuthenticationError,
  DuplicateResourceError
} = require('../utils/customErrors');

// Generate JWT token with 24-hour expiration as specified in Section 9
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h' // Use environment variable or default
  });
};

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed');
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      throw new DuplicateResourceError('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password // Will be hashed by pre-save middleware
    });

    if (!user) {
      throw new CustomError('Invalid user data provided', 400);
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed');
    }

    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if password is correct
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user data
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user._id);
    
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          bio: user.bio,
          phone: user.phone,
          address: user.address,
          isVerified: user.isVerified,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    // Fields to update (exclude password and role)
    const updates = {};
    const allowedUpdates = ['name', 'email', 'bio', 'phone', 'address'];
    
    // Only allow updates to allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          bio: user.bio,
          phone: user.phone,
          address: user.address,
          isVerified: user.isVerified,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};