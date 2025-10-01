const express = require('express');
const {
  compareProducts,
  addToComparison,
  removeFromComparison,
  getComparison,
  clearComparison
} = require('../controllers/comparison');

const router = express.Router();

// Public routes
router.route('/')
  .post(compareProducts);

// Private routes (would typically have protect middleware)
router.route('/add')
  .post(addToComparison);

router.route('/remove/:productId')
  .delete(removeFromComparison);

router.route('/')
  .get(getComparison);

router.route('/clear')
  .delete(clearComparison);

module.exports = router;