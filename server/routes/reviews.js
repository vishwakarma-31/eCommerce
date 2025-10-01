const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markAsHelpful
} = require('../controllers/reviews');
const { protect, isBacker } = require('../middleware/auth');

// GET /api/reviews/product/:productId - Get all reviews for a product
router.get('/product/:productId', getProductReviews);

// POST /api/reviews/ - Create new review (protected, verified purchase only)
router.post('/', protect, isBacker, createReview);

// PUT /api/reviews/:id - Update own review (protected)
router.put('/:id', protect, updateReview);

// DELETE /api/reviews/:id - Delete own review (protected)
router.delete('/:id', protect, deleteReview);

// POST /api/reviews/:id/helpful - Mark review as helpful (protected)
router.post('/:id/helpful', protect, markAsHelpful);

module.exports = router;