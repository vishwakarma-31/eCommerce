const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getFeaturedProducts,
  getTrendingProducts,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  likeProduct,
  viewProduct
} = require('../controllers/products');
const { protect, isCreator, isAdmin } = require('../middleware/auth');
const { upload, processImages } = require('../middleware/imageUpload');

// GET /api/products - Get all products (with pagination, filtering, sorting)
router.get('/', getAllProducts);

// GET /api/products/featured - Get featured products
router.get('/featured', getFeaturedProducts);

// GET /api/products/trending - Get trending products
router.get('/trending', getTrendingProducts);

// GET /api/products/search - Search products by title/description
router.get('/search', searchProducts);

// GET /api/products/:id - Get single product by ID
router.get('/:id', getProductById);

// POST /api/products/ - Create new product (Creator only, protected)
router.post('/', protect, isCreator, createProduct);

// PUT /api/products/:id - Update product (Creator/Admin, protected)
router.put('/:id', protect, isCreator, updateProduct);

// DELETE /api/products/:id - Delete product (Creator/Admin, protected)
router.delete('/:id', protect, isCreator, deleteProduct);

// POST /api/products/:id/images - Upload product images (Creator, protected)
router.post('/:id/images', protect, isCreator, upload.array('images', 5), processImages, uploadProductImages);

// POST /api/products/:id/like - Like/unlike product (protected)
router.post('/:id/like', protect, likeProduct);

// POST /api/products/:id/view - Increment view count
router.post('/:id/view', viewProduct);

module.exports = router;