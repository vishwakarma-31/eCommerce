const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlist');
const { protect, isBacker } = require('../middleware/auth');

// GET /api/wishlist - Get user's wishlist
router.get('/', protect, isBacker, getWishlist);

// POST /api/wishlist - Add product to wishlist
router.post('/', protect, isBacker, addToWishlist);

// DELETE /api/wishlist - Remove product from wishlist
router.delete('/', protect, isBacker, removeFromWishlist);

module.exports = router;