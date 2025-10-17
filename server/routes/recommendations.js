const express = require('express');
const {
  getPersonalizedRecommendations,
  getTrendingProducts,
  getBrowsingHistoryRecommendations,
  getCartBasedRecommendations
} = require('../controllers/recommendations');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.route('/trending')
  .get(getTrendingProducts);

// Private routes
router.route('/personalized')
  .get(protect, getPersonalizedRecommendations);

router.route('/browsing-history')
  .get(protect, getBrowsingHistoryRecommendations);

router.route('/cart')
  .get(protect, getCartBasedRecommendations);

module.exports = router;