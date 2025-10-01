const RecommendationEngine = require('../services/recommendationService');
const AnalyticsService = require('../services/analyticsService');
const ProductConcept = require('../models/ProductConcept');
const { protect } = require('../middleware/auth');

/**
 * Get product recommendations for the current user
 * @route GET /api/recommendations/user
 * @access Private
 */
const getUserRecommendations = async (req, res) => {
  try {
    const recommendations = await RecommendationEngine.getUserRecommendations(req.user, 10);
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get trending products
 * @route GET /api/recommendations/trending
 * @access Public
 */
const getTrendingProducts = async (req, res) => {
  try {
    const trending = await RecommendationEngine.getTrendingProducts(10);
    res.status(200).json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get popular products in a category
 * @route GET /api/recommendations/category/:categoryId
 * @access Public
 */
const getPopularInCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const popular = await RecommendationEngine.getPopularInCategory(categoryId, 10);
    res.status(200).json(popular);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get analytics data - total sales per product
 * @route GET /api/analytics/sales
 * @access Private/Admin
 */
const getTotalSalesPerProduct = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const salesData = await AnalyticsService.getTotalSalesPerProduct();
    res.status(200).json(salesData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get revenue trends
 * @route GET /api/analytics/revenue
 * @access Private/Admin
 */
const getRevenueTrends = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { months = 6 } = req.query;
    const trendData = await AnalyticsService.getRevenueTrends(parseInt(months));
    res.status(200).json(trendData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get user engagement metrics
 * @route GET /api/analytics/engagement
 * @access Private/Admin
 */
const getUserEngagementMetrics = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const metrics = await AnalyticsService.getUserEngagementMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get conversion rates
 * @route GET /api/analytics/conversion
 * @access Private/Admin
 */
const getConversionRates = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const conversionData = await AnalyticsService.getConversionRates();
    res.status(200).json(conversionData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get top performing categories
 * @route GET /api/analytics/categories
 * @access Private/Admin
 */
const getTopCategories = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const categoryData = await AnalyticsService.getTopCategories();
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserRecommendations,
  getTrendingProducts,
  getPopularInCategory,
  getTotalSalesPerProduct,
  getRevenueTrends,
  getUserEngagementMetrics,
  getConversionRates,
  getTopCategories
};