const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon
} = require('../controllers/cart');
const { protect, authorize } = require('../middleware/auth');

// Create role-specific middleware
const isBacker = authorize('Backer', 'Creator', 'Admin');

// GET /api/cart/ - Get user's cart (protected)
router.get('/', protect, isBacker, getCart);

// POST /api/cart/add - Add item to cart (protected)
router.post('/add', protect, isBacker, addToCart);

// PUT /api/cart/update/:itemId - Update item quantity (protected)
router.put('/update/:itemId', protect, isBacker, updateCartItem);

// DELETE /api/cart/remove/:itemId - Remove item from cart (protected)
router.delete('/remove/:itemId', protect, isBacker, removeFromCart);

// DELETE /api/cart/clear - Clear entire cart (protected)
router.delete('/clear', protect, isBacker, clearCart);

// POST /api/cart/apply-coupon - Apply coupon code (protected)
router.post('/apply-coupon', protect, isBacker, applyCoupon);

module.exports = router;