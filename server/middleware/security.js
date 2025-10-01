const rateLimit = require('express-rate-limit');
const xss = require('xss');

// Rate limiting for sensitive endpoints as specified in Section 9
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: {
    error: 'Too many registration attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// XSS sanitization middleware
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (const [key, value] of Object.entries(req.body)) {
      // Skip password fields as they shouldn't be sanitized
      if (key.toLowerCase().includes('password')) continue;
      
      if (typeof value === 'string') {
        req.body[key] = xss(value);
      }
    }
  }
  
  if (req.query) {
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string') {
        req.query[key] = xss(value);
      }
    }
  }
  
  next();
};

module.exports = {
  loginLimiter,
  registerLimiter,
  sanitizeInput
};