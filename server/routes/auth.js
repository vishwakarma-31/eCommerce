const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword
} = require('../controllers/auth');
const { 
  verifyEmail, 
  resendVerificationEmail 
} = require('../controllers/improvedAuth');
const { protect } = require('../middleware/auth');

// Register validation with stronger requirements as specified in Section 9
const registerValidation = [
  body('name')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
    .trim()
    .escape(), // Escape HTML characters to prevent XSS
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(), // Normalize email format
  body('password')
    .isLength({ min: 8 }) // Strong password requirements (min 8 chars)
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
];

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .exists()
    .withMessage('Password is required')
];

// Email verification validation
const emailVerificationValidation = [
  body('token')
    .exists()
    .withMessage('Verification token is required')
];

// Resend verification email validation
const resendVerificationValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

// POST /api/auth/register - Register new user
router.post('/register', registerValidation, registerUser);

// POST /api/auth/login - Login user, return JWT
router.post('/login', loginValidation, loginUser);

// POST /api/auth/logout - Logout user (clear token client-side)
router.post('/logout', logoutUser);

// GET /api/auth/me - Get current user data (protected)
router.get('/me', protect, getMe);

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password/:token - Reset password with token
router.post('/reset-password/:token', resetPassword);

// PUT /api/auth/change-password - Change password (protected)
router.put('/change-password', protect, changePassword);

// POST /api/auth/verify-email - Verify email with token
router.post('/verify-email', emailVerificationValidation, verifyEmail);

// POST /api/auth/resend-verification - Resend verification email
router.post('/resend-verification', resendVerificationValidation, resendVerificationEmail);

module.exports = router;