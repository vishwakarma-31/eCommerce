# LaunchPad Market - Controller Layer Structure

This document details the controller layer structure implemented for the LaunchPad Market platform, following the specification in Section 26.

## Example: Product Controller

The product controller demonstrates the standard structure for all controllers in the application.

### Implementation
```javascript
// productController.js
const Product = require('../models/ProductConcept');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const { category, status, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
  
  let query = {};
  
  // Build query
  if (category) query.category = category;
  if (status) query.status = status;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }
  
  // Execute query with pagination
  const skip = (page - 1) * limit;
  const products = await Product.find(query)
    .populate('creator', 'name profileImage')
    .sort(sort || '-createdAt')
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Product.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: products
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Creator only)
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Add creator from logged-in user
  req.body.creator = req.user.id;
  
  // Generate slug from title
  req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const product = await Product.create(req.body);
  
  res.status(201).json({
    success: true,
    data: product
  });
});

// Additional controller methods...
```

## Controller Structure Components

### 1. Required Imports
All controllers follow a consistent import pattern:
```javascript
const Model = require('../models/Model');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
```

### 2. Route Documentation
Each controller method includes JSDoc-style comments:
```javascript
// @desc    Brief description of what the route does
// @route   HTTP_METHOD /api/endpoint
// @access  Public/Private/Role-specific
```

### 3. Async Handler Wrapper
All controller methods are wrapped with `asyncHandler`:
```javascript
exports.methodName = asyncHandler(async (req, res, next) => {
  // Controller logic here
});
```

### 4. Error Handling
Errors are handled using the `ErrorResponse` class:
```javascript
if (!resource) {
  return next(new ErrorResponse('Error message', 404));
}
```

### 5. Consistent Response Format
All responses follow a consistent JSON structure:
```javascript
res.status(200).json({
  success: true,
  count: resources.length,
  data: resources
});
```

## Standard Controller Methods

### Get All Resources
```javascript
exports.getResources = asyncHandler(async (req, res, next) => {
  // Parse query parameters
  const { page = 1, limit = 12, sort = '-createdAt' } = req.query;
  
  // Build query
  const query = {};
  
  // Execute query with pagination
  const skip = (page - 1) * limit;
  const resources = await Model.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Model.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: resources.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: resources
  });
});
```

### Get Single Resource
```javascript
exports.getResource = asyncHandler(async (req, res, next) => {
  const resource = await Model.findById(req.params.id);
  
  if (!resource) {
    return next(new ErrorResponse(`Resource not found`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: resource
  });
});
```

### Create Resource
```javascript
exports.createResource = asyncHandler(async (req, res, next) => {
  const resource = await Model.create(req.body);
  
  res.status(201).json({
    success: true,
    data: resource
  });
});
```

### Update Resource
```javascript
exports.updateResource = asyncHandler(async (req, res, next) => {
  let resource = await Model.findById(req.params.id);
  
  if (!resource) {
    return next(new ErrorResponse(`Resource not found`, 404));
  }
  
  // Authorization check if needed
  if (resource.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized`, 401));
  }
  
  resource = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: resource
  });
});
```

### Delete Resource
```javascript
exports.deleteResource = asyncHandler(async (req, res, next) => {
  const resource = await Model.findById(req.params.id);
  
  if (!resource) {
    return next(new ErrorResponse(`Resource not found`, 404));
  }
  
  // Authorization check if needed
  if (resource.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized`, 401));
  }
  
  await resource.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});
```

## Best Practices

1. **Consistent Naming**: Controller method names follow a standard pattern
2. **Proper Error Handling**: All errors are properly handled and forwarded
3. **Pagination**: All list endpoints implement pagination
4. **Authorization**: Role-based access control is implemented where needed
5. **Validation**: Input validation is handled at the route level
6. **Populate**: Related data is populated when needed
7. **Response Format**: All responses follow a consistent format

## Integration Example

Here's how the controller integrates with routes:

```javascript
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('Creator', 'Admin'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('Creator', 'Admin'), updateProduct)
  .delete(protect, authorize('Creator', 'Admin'), deleteProduct);

module.exports = router;
```

## Testing

Controller methods have been tested for:
1. Correct data retrieval and manipulation
2. Proper error handling
3. Authorization checks
4. Pagination functionality
5. Response format consistency

## Future Enhancements

1. **Advanced Filtering**: Implement more complex filtering options
2. **Caching**: Add caching for frequently accessed data
3. **Rate Limiting**: Implement rate limiting at the controller level
4. **Logging**: Add detailed logging for debugging
5. **Analytics**: Implement usage analytics