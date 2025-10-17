const asyncHandler = require('../middleware/asyncHandler');
const RecommendationEngine = require('../services/recommendationService');

// @desc    Get personalized recommendations for user
// @route   GET /api/recommendations/personalized
// @access  Private
exports.getPersonalizedRecommendations = asyncHandler(async (req, res, next) => {
  const { limit = 10 } = req.query;
  
  // In a real implementation, you would get the user's cart items
  const cartItems = []; // Get from cart service
  
  const recommendations = await RecommendationEngine.getPersonalizedRecommendations(
    req.user,
    cartItems,
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    count: recommendations.length,
    data: recommendations
  });
});

// @desc    Get trending products
// @route   GET /api/recommendations/trending
// @access  Public
exports.getTrendingProducts = asyncHandler(async (req, res, next) => {
  const { limit = 10 } = req.query;
  
  const trending = await RecommendationEngine.getTrendingProducts(parseInt(limit));
  
  res.status(200).json({
    success: true,
    count: trending.length,
    data: trending
  });
});

// @desc    Get recommendations based on browsing history
// @route   GET /api/recommendations/browsing-history
// @access  Private
exports.getBrowsingHistoryRecommendations = asyncHandler(async (req, res, next) => {
  const { limit = 10 } = req.query;
  
  const recommendations = await RecommendationEngine.getBrowsingHistoryRecommendations(
    req.user.browsingHistory || [],
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    count: recommendations.length,
    data: recommendations
  });
});

// @desc    Get recommendations based on cart items
// @route   GET /api/recommendations/cart
// @access  Private
exports.getCartBasedRecommendations = asyncHandler(async (req, res, next) => {
  const { limit = 10 } = req.query;
  
  // In a real implementation, you would get the user's cart items
  const cartItems = []; // Get from cart service
  
  const recommendations = await RecommendationEngine.getCartBasedRecommendations(
    cartItems,
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    count: recommendations.length,
    data: recommendations
  });
});