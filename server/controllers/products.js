const productService = require('../services/productService');
const { CustomError, ValidationError, NotFoundError, AuthorizationError } = require('../utils/customErrors');
const asyncHandler = require('../middleware/asyncHandler');
const { upload, uploadThumbnail, generateResponsiveImageUrls } = require('../middleware/cloudinaryUpload');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res, next) => {
  const result = await productService.getAllProducts(req.query);
  
  res.status(200).json({
    success: true,
    count: result.products.length,
    data: result
  });
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);
  
  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private (Creator/Admin)
 */
const createProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.createProduct(req.body, req.user.id);
  
  res.status(201).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private (Creator/Admin)
 */
const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role
  );
  
  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
 */
const deleteProduct = asyncHandler(async (req, res, next) => {
  const result = await productService.deleteProduct(
    req.params.id,
    req.user.id,
    req.user.role
  );
  
  res.status(200).json({
    success: true,
    data: result
  });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 8;
  const products = await productService.getFeaturedProducts(limit);
  
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

/**
 * @desc    Get new arrival products
 * @route   GET /api/products/new-arrivals
 * @access  Public
 */
const getNewArrivalProducts = asyncHandler(async (req, res, next) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 8;
  const products = await productService.getNewArrivalProducts(limit);
  
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

/**
 * @desc    Get best seller products
 * @route   GET /api/products/best-sellers
 * @access  Public
 */
const getBestSellerProducts = asyncHandler(async (req, res, next) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 8;
  const products = await productService.getBestSellerProducts(limit);
  
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

/**
 * @desc    Get related products
 * @route   GET /api/products/related/:id
 * @access  Public
 */
const getRelatedProducts = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const options = req.query;
  
  const products = await productService.getEnhancedRelatedProducts(id, options);
  
  res.status(200).json({
    success: true,
    count: products.length,
    data: {
      products
    }
  });
});

/**
 * @desc    Search products
 * @route   GET /api/products/search
 * @access  Public
 */
const searchProducts = asyncHandler(async (req, res, next) => {
  const result = await productService.searchProducts(req.query);
  
  res.status(200).json({
    success: true,
    count: result.products.length,
    data: result
  });
});

/**
 * @desc    Upload product images
 * @route   POST /api/products/:id/upload-images
 * @access  Private (Creator/Admin)
 */
const uploadProductImages = asyncHandler(async (req, res, next) => {
  // Handle file upload
  upload.array('images', 5)(req, res, async (err) => {
    if (err) {
      return next(new CustomError(`File upload error: ${err.message}`, 400));
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return next(new CustomError('Please upload at least one image', 400));
    }

    // Extract image URLs from uploaded files and generate responsive versions
    const imageUrls = req.files.map(file => {
      // Generate responsive image URLs
      return generateResponsiveImageUrls(file.filename);
    });

    // Add images to product
    const product = await productService.addProductImages(
      req.params.id,
      imageUrls.map(img => img.original), // Use original size for product images
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        product,
        images: imageUrls
      }
    });
  });
});

/**
 * @desc    Delete product image
 * @route   DELETE /api/products/:id/images/:imageId
 * @access  Private (Creator/Admin)
 */
const deleteProductImage = asyncHandler(async (req, res, next) => {
  const product = await productService.removeProductImage(
    req.params.id,
    req.params.imageId,
    req.user.id,
    req.user.role
  );
  
  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Add question to product
 * @route   POST /api/products/:id/questions
 * @access  Private
 */
const addQuestion = asyncHandler(async (req, res, next) => {
  const product = await productService.addQuestion(
    req.params.id,
    req.user.id,
    req.body.question
  );
  
  res.status(201).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Add answer to product question
 * @route   POST /api/products/:id/questions/:questionId/answers
 * @access  Private (Admin/Creator)
 */
const addAnswer = asyncHandler(async (req, res, next) => {
  const product = await productService.addAnswer(
    req.params.id,
    req.params.questionId,
    req.user.id,
    req.body.answer,
    req.user.role === 'Admin' || req.user.role === 'Creator'
  );
  
  res.status(201).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Upvote product question
 * @route   POST /api/products/:id/questions/:questionId/upvote
 * @access  Private
 */
const upvoteQuestion = asyncHandler(async (req, res, next) => {
  const product = await productService.upvoteQuestion(
    req.params.id,
    req.params.questionId,
    req.user.id
  );
  
  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Upvote product answer
 * @route   POST /api/products/:id/questions/:questionId/answers/:answerId/upvote
 * @access  Private
 */
const upvoteAnswer = asyncHandler(async (req, res, next) => {
  const product = await productService.upvoteAnswer(
    req.params.id,
    req.params.questionId,
    req.params.answerId,
    req.user.id
  );
  
  res.status(200).json({
    success: true,
    data: product
  });
});

module.exports = {
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
  // Q&A methods
  addQuestion,
  addAnswer,
  upvoteQuestion,
  upvoteAnswer
};