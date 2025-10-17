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
const { sendVerificationEmail, sendWelcomeEmail } = require('../utils/emailService');
const crypto = require('crypto');

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

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the registration if email sending fails
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully. Please check your email to verify your account.',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
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

    // Check if account is locked
    if (user.isLocked()) {
      throw new AuthenticationError(`Account is locked. Try again after ${new Date(user.lockUntil).toLocaleTimeString()}`);
    }

    // Check if password is correct
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      // Increment failed login attempts
      await user.incLoginAttempts();
      
      // If account is now locked, send appropriate message
      if (user.isLocked()) {
        throw new AuthenticationError(`Account locked due to too many failed attempts. Try again after ${new Date(user.lockUntil).toLocaleTimeString()}`);
      }
      
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw new AuthenticationError('Please verify your email address before logging in');
    }

    // Reset failed login attempts on successful login
    await user.resetLoginAttempts();

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
          role: user.role,
          isVerified: user.isVerified
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

/**
 * @desc    Verify user email
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    // Find user with matching verification token and not expired
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new CustomError('Invalid or expired verification token', 400);
    }

    // Mark user as verified
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully!'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resend verification email
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new CustomError('User not found with this email', 404);
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(200).json({
        status: 'success',
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      throw new CustomError('Failed to send verification email', 500);
    }

    res.status(200).json({
      status: 'success',
      message: 'Verification email sent successfully! Please check your inbox.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  verifyEmail,
  resendVerificationEmail
};