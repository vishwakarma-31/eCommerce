const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  createPreOrder,
  getMyPreOrders,
  getPreOrderById,
  cancelPreOrder
} = require('../controllers/preorders');
const { protect, isBacker } = require('../middleware/auth');

// POST /api/preorders/create-payment-intent - Create Stripe payment intent (protected)
router.post('/create-payment-intent', protect, isBacker, createPaymentIntent);

// POST /api/preorders/ - Create new pre-order (protected)
router.post('/', protect, isBacker, createPreOrder);

// GET /api/preorders/my-preorders - Get user's pre-orders (protected)
router.get('/my-preorders', protect, isBacker, getMyPreOrders);

// GET /api/preorders/:id - Get single pre-order details (protected)
router.get('/:id', protect, isBacker, getPreOrderById);

// PUT /api/preorders/:id/cancel - Cancel pre-order (protected)
router.put('/:id/cancel', protect, isBacker, cancelPreOrder);

module.exports = router;