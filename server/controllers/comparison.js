const ProductConcept = require('../models/ProductConcept');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Compare products
// @route   POST /api/compare
// @access  Public
exports.compareProducts = asyncHandler(async (req, res, next) => {
  const { productIds } = req.body;
  
  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return next(new ErrorResponse('Please provide product IDs to compare', 400));
  }
  
  if (productIds.length > 4) {
    return next(new ErrorResponse('You can compare up to 4 products', 400));
  }
  
  // Get products by IDs
  const products = await ProductConcept.find({
    _id: { $in: productIds },
    status: { $ne: 'Discontinued' }
  }).populate('creator', 'name profileImage');
  
  if (products.length !== productIds.length) {
    return next(new ErrorResponse('One or more products not found', 404));
  }
  
  // Create comparison data
  const comparisonData = {
    products: products.map(product => ({
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      fundingGoal: product.fundingGoal,
      currentFunding: product.currentFunding,
      fundingProgress: product.fundingGoal > 0 ? Math.round((product.currentFunding / product.fundingGoal) * 100) : 0,
      deadline: product.deadline,
      status: product.status,
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
      category: product.category,
      creator: product.creator,
      images: product.images
    })),
    comparison: {
      titles: products.map(p => p.title),
      prices: products.map(p => p.price),
      fundingProgress: products.map(p => 
        p.fundingGoal > 0 ? Math.round((p.currentFunding / p.fundingGoal) * 100) : 0
      ),
      ratings: products.map(p => p.averageRating),
      categories: products.map(p => p.category),
      creators: products.map(p => p.creator.name)
    }
  };
  
  res.status(200).json({
    success: true,
    data: comparisonData
  });
});

// @desc    Add product to comparison
// @route   POST /api/compare/add
// @access  Private
exports.addToComparison = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  
  if (!productId) {
    return next(new ErrorResponse('Product ID is required', 400));
  }
  
  // Initialize comparison array in user session if it doesn't exist
  if (!req.session.comparison) {
    req.session.comparison = [];
  }
  
  // Check if product is already in comparison
  if (req.session.comparison.includes(productId)) {
    return next(new ErrorResponse('Product is already in comparison', 400));
  }
  
  // Limit to 4 products
  if (req.session.comparison.length >= 4) {
    return next(new ErrorResponse('You can compare up to 4 products', 400));
  }
  
  // Add product to comparison
  req.session.comparison.push(productId);
  
  res.status(200).json({
    success: true,
    message: 'Product added to comparison',
    comparison: req.session.comparison
  });
});

// @desc    Remove product from comparison
// @route   DELETE /api/compare/remove/:productId
// @access  Private
exports.removeFromComparison = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  
  if (!productId) {
    return next(new ErrorResponse('Product ID is required', 400));
  }
  
  // Initialize comparison array in user session if it doesn't exist
  if (!req.session.comparison) {
    req.session.comparison = [];
  }
  
  // Remove product from comparison
  req.session.comparison = req.session.comparison.filter(id => id !== productId);
  
  res.status(200).json({
    success: true,
    message: 'Product removed from comparison',
    comparison: req.session.comparison
  });
});

// @desc    Get current comparison
// @route   GET /api/compare
// @access  Private
exports.getComparison = asyncHandler(async (req, res, next) => {
  // Initialize comparison array in user session if it doesn't exist
  if (!req.session.comparison) {
    req.session.comparison = [];
  }
  
  // Get products in comparison
  const products = await ProductConcept.find({
    _id: { $in: req.session.comparison },
    status: { $ne: 'Discontinued' }
  }).populate('creator', 'name profileImage');
  
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Clear comparison
// @route   DELETE /api/compare/clear
// @access  Private
exports.clearComparison = asyncHandler(async (req, res, next) => {
  req.session.comparison = [];
  
  res.status(200).json({
    success: true,
    message: 'Comparison cleared'
  });
});