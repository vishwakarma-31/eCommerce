const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlist');
const { protect, authorize } = require('../middleware/auth');

// Create role-specific middleware
const isBacker = authorize('Backer', 'Creator', 'Admin');

// GET /api/wishlist - Get user's wishlist
router.get('/', protect, isBacker, getWishlist);

// POST /api/wishlist - Add product to wishlist
router.post('/', protect, isBacker, addToWishlist);

// DELETE /api/wishlist - Remove product from wishlist
router.delete('/', protect, isBacker, removeFromWishlist);

module.exports = router;