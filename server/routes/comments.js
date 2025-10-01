const express = require('express');
const router = express.Router();
const {
  getProductComments,
  createComment,
  replyToComment,
  updateComment,
  deleteComment,
  likeComment
} = require('../controllers/comments');
const { protect, isBacker } = require('../middleware/auth');

// GET /api/comments/product/:productId - Get all comments for a product
router.get('/product/:productId', getProductComments);

// POST /api/comments/ - Create new comment (protected)
router.post('/', protect, isBacker, createComment);

// POST /api/comments/:id/reply - Reply to a comment (protected)
router.post('/:id/reply', protect, isBacker, replyToComment);

// PUT /api/comments/:id - Update own comment (protected)
router.put('/:id', protect, updateComment);

// DELETE /api/comments/:id - Delete own comment (protected)
router.delete('/:id', protect, deleteComment);

// POST /api/comments/:id/like - Like/unlike comment (protected)
router.post('/:id/like', protect, likeComment);

module.exports = router;