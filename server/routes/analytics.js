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

// New analytics controller
const {
  getDashboardMetrics,
  getSalesAnalytics,
  getProductAnalytics,
  getUserAnalytics,
  getOrderAnalytics,
  getRevenueBreakdown,
  exportCSV,
  exportPDF
} = require('../controllers/analyticsController');

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

// New analytics endpoints
router.get('/analytics/dashboard', protect, isAdmin, getDashboardMetrics);
router.get('/analytics/sales-analytics', protect, isAdmin, getSalesAnalytics);
router.get('/analytics/products', protect, isAdmin, getProductAnalytics);
router.get('/analytics/users', protect, isAdmin, getUserAnalytics);
router.get('/analytics/orders', protect, isAdmin, getOrderAnalytics);
router.get('/analytics/revenue-breakdown', protect, isAdmin, getRevenueBreakdown);
router.get('/analytics/export/csv', protect, isAdmin, exportCSV);
router.get('/analytics/export/pdf', protect, isAdmin, exportPDF);

module.exports = router;