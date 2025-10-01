const express = require('express');
const router = express.Router();
const {
  createPayment,
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  trackOrder
} = require('../controllers/orders');
const { protect, isBacker } = require('../middleware/auth');

// POST /api/orders/create-payment - Create payment for marketplace order (protected)
router.post('/create-payment', protect, isBacker, createPayment);

// POST /api/orders/ - Create new order (protected)
router.post('/', protect, isBacker, createOrder);

// GET /api/orders/my-orders - Get user's orders (protected)
router.get('/my-orders', protect, isBacker, getMyOrders);

// GET /api/orders/:id - Get single order details (protected)
router.get('/:id', protect, isBacker, getOrderById);

// PUT /api/orders/:id/cancel - Cancel order (protected)
router.put('/:id/cancel', protect, isBacker, cancelOrder);

// GET /api/orders/:id/track - Get order tracking info (protected)
router.get('/:id/track', protect, isBacker, trackOrder);

module.exports = router;