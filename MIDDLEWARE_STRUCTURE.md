# LaunchPad Market - Middleware Structure

This document details the middleware structure implemented for the LaunchPad Market platform, following the specification in Section 25.

## A. Authentication Middleware

The authentication middleware handles user authentication and authorization for protected routes.

### Implementation
```javascript
// authMiddleware.js
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
```

### Usage
1. **Protect Routes**: Use `protect` middleware to ensure user is authenticated
2. **Authorize Roles**: Use `authorize` middleware to restrict access based on user roles

### Example Usage
```javascript
const { protect, authorize } = require('../middleware/auth');

// Protect a route
router.get('/protected', protect, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Restrict to specific roles
router.get('/admin', protect, authorize('Admin'), (req, res) => {
  res.json({ message: 'This is an admin-only route' });
});
```

## B. Validation Middleware

The validation middleware handles request validation using express-validator.

### Implementation
```javascript
// validationMiddleware.js
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

module.exports = validate;
```

### Usage
1. Define validation rules using express-validator
2. Apply the `validate` middleware after validation rules

### Example Usage
```javascript
const { body } = require('express-validator');
const validate = require('../middleware/validationMiddleware');

const userValidation = [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

router.post('/users', userValidation, validate, (req, res) => {
  res.json({ message: 'User created successfully' });
});
```

## C. Async Handler

The async handler middleware simplifies error handling for asynchronous route handlers.

### Implementation
```javascript
// asyncHandler.js
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
```

### Usage
Wrap asynchronous route handlers with `asyncHandler` to automatically catch and forward errors to Express error handling middleware.

### Example Usage
```javascript
const asyncHandler = require('../middleware/asyncHandler');

router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));
```

## Integration Example

Here's how all middleware components work together:

```javascript
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validationMiddleware');
const asyncHandler = require('../middleware/asyncHandler');
const { body } = require('express-validator');

const router = express.Router();

// Validation rules
const createUserValidation = [
  body('name').isLength({ min: 2 }).withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('role').isIn(['Admin', 'Creator', 'Backer']).withMessage('Invalid role')
];

// Route with all middleware
router.post('/users', 
  protect, 
  authorize('Admin'),
  createUserValidation,
  validate,
  asyncHandler(async (req, res) => {
    // Create user logic here
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  })
);

module.exports = router;
```

## Error Handling Flow

1. **Authentication Errors**: Handled by `protect` middleware (401 Unauthorized)
2. **Authorization Errors**: Handled by `authorize` middleware (403 Forbidden)
3. **Validation Errors**: Handled by `validate` middleware (400 Bad Request)
4. **Application Errors**: Handled by `asyncHandler` and forwarded to Express error handler
5. **Unhandled Errors**: Caught by global error handling middleware

## Best Practices

1. **Order Matters**: Apply middleware in the correct order (authentication before authorization)
2. **Consistent Responses**: All middleware return consistent JSON error responses
3. **Security**: Authentication middleware excludes password from user object
4. **Performance**: Async handler prevents unhandled promise rejections
5. **Maintainability**: Each middleware has a single responsibility

## Testing

The middleware components have been tested for:
1. Correct authentication token validation
2. Proper role-based authorization
3. Validation error handling
4. Async error propagation
5. Integration with route handlers

## Future Enhancements

1. **Rate Limiting Middleware**: Add rate limiting for API endpoints
2. **CORS Middleware**: Configure CORS settings for cross-origin requests
3. **Compression Middleware**: Add response compression for better performance
4. **Logging Middleware**: Implement request/response logging
5. **Security Headers Middleware**: Add security headers to responses