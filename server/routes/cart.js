const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cart');
const { protect, isBacker } = require('../middleware/auth');

// GET /api/cart/ - Get user's cart (protected)
router.get('/', protect, isBacker, getCart);

// POST /api/cart/add - Add item to cart (protected)
router.post('/add', protect, isBacker, addToCart);

// PUT /api/cart/update/:productId - Update item quantity (protected)
router.put('/update/:productId', protect, isBacker, updateCartItem);

// DELETE /api/cart/remove/:productId - Remove item from cart (protected)
router.delete('/remove/:productId', protect, isBacker, removeFromCart);

// DELETE /api/cart/clear - Clear entire cart (protected)
router.delete('/clear', protect, isBacker, clearCart);

module.exports = router;