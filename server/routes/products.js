const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivalProducts,
  getBestSellerProducts,
  getRelatedProducts,
  searchProducts,
  uploadProductImages,
  deleteProductImage,
  addQuestion,
  addAnswer,
  upvoteQuestion,
  upvoteAnswer
} = require('../controllers/products');
const { protect, authorize } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// Public routes with caching
router.route('/')
  .get(cacheMiddleware(300), getProducts); // Cache for 5 minutes

router.route('/:id')
  .get(cacheMiddleware(600), getProduct); // Cache for 10 minutes

router.route('/featured')
  .get(cacheMiddleware(300), getFeaturedProducts); // Cache for 5 minutes

router.route('/new-arrivals')
  .get(cacheMiddleware(300), getNewArrivalProducts); // Cache for 5 minutes

router.route('/best-sellers')
  .get(cacheMiddleware(300), getBestSellerProducts); // Cache for 5 minutes

router.route('/related/:id')
  .get(getRelatedProducts);

router.route('/search')
  .get(cacheMiddleware(120), searchProducts); // Cache for 2 minutes

// Protected routes
router.route('/')
  .post(protect, authorize('Creator', 'Admin'), createProduct);

router.route('/:id')
  .put(protect, authorize('Creator', 'Admin'), updateProduct)
  .delete(protect, authorize('Admin'), deleteProduct);

router.route('/:id/upload-images')
  .post(protect, authorize('Creator', 'Admin'), uploadProductImages);

router.route('/:id/images/:imageId')
  .delete(protect, authorize('Creator', 'Admin'), deleteProductImage);

// Q&A routes
router.route('/:id/questions')
  .post(protect, addQuestion);

router.route('/:id/questions/:questionId/answers')
  .post(protect, authorize('Admin', 'Creator'), addAnswer);

router.route('/:id/questions/:questionId/upvote')
  .post(protect, upvoteQuestion);

router.route('/:id/questions/:questionId/answers/:answerId/upvote')
  .post(protect, upvoteAnswer);

module.exports = router;