const express = require('express');
const router = express.Router();
const {
  getUserRecommendations,
  getTrendingProducts,
  getPopularInCategory,
  getTotalSalesPerProduct,
  getRevenueTrends,
  getUserEngagementMetrics,
  getConversionRates,
  getTopCategories
} = require('../controllers/analytics');
const { protect, isAdmin } = require('../middleware/auth');

// Recommendation routes
router.get('/recommendations/user', protect, getUserRecommendations);
router.get('/recommendations/trending', getTrendingProducts);
router.get('/recommendations/category/:categoryId', getPopularInCategory);

// Analytics routes
router.get('/analytics/sales', protect, isAdmin, getTotalSalesPerProduct);
router.get('/analytics/revenue', protect, isAdmin, getRevenueTrends);
router.get('/analytics/engagement', protect, isAdmin, getUserEngagementMetrics);
router.get('/analytics/conversion', protect, isAdmin, getConversionRates);
router.get('/analytics/categories', protect, isAdmin, getTopCategories);

module.exports = router;