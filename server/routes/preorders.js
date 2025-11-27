const express = require('express');
const router = express.Router();
const {
  createPreOrder,
  getMyPreOrders,
  getPreOrderById,
  cancelPreOrder
} = require('../controllers/preorders');
const { protect, authorize } = require('../middleware/auth');

// Create role-specific middleware
const isBacker = authorize('Backer', 'Creator', 'Admin');

// POST /api/preorders/ - Create new pre-order (protected)
router.post('/', protect, isBacker, createPreOrder);

// GET /api/preorders/my-preorders - Get user's pre-orders (protected)
router.get('/my-preorders', protect, isBacker, getMyPreOrders);

// GET /api/preorders/:id - Get single pre-order details (protected)
router.get('/:id', protect, isBacker, getPreOrderById);

// PUT /api/preorders/:id/cancel - Cancel pre-order (protected)
router.put('/:id/cancel', protect, isBacker, cancelPreOrder);

module.exports = router;