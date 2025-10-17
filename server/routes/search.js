const express = require('express');
const router = express.Router();
const {
  searchProducts,
  getSearchSuggestions,
  getPopularSearches,
  getUserSearchHistory
} = require('../controllers/searchController');
const { protect } = require('../middleware/auth');

// GET /api/search - Main search endpoint with all filters
router.get('/', searchProducts);

// GET /api/search/suggestions - Search autocomplete
router.get('/suggestions', getSearchSuggestions);

// GET /api/search/popular - Popular searches
router.get('/popular', getPopularSearches);

// GET /api/search/history - User search history (protected)
router.get('/history', protect, getUserSearchHistory);

module.exports = router;