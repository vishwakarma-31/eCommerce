const ProductConcept = require('../models/ProductConcept');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const { category, status, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
  
  let query = {};
  
  // Build query
  if (category) query.category = category;
  if (status) query.status = status;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }
  
  // Execute query with pagination
  const skip = (page - 1) * limit;
  const products = await ProductConcept.find(query)
    .populate('creator', 'name profileImage')
    .sort(sort || '-createdAt')
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await ProductConcept.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: products
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Creator only)
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Add creator from logged-in user
  req.body.creator = req.user.id;
  
  // Generate slug from title
  req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const product = await ProductConcept.create(req.body);
  
  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductConcept.findById(req.params.id).populate('creator', 'name profileImage');
  
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Creator/Admin only)
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await ProductConcept.findById(req.params.id);
  
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user is the creator or admin
  if (product.creator.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse(`Not authorized to update this product`, 401));
  }
  
  product = await ProductConcept.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Creator/Admin only)
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductConcept.findById(req.params.id);
  
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user is the creator or admin
  if (product.creator.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse(`Not authorized to delete this product`, 401));
  }
  
  await product.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * Get all products with comprehensive filtering and sorting
 * Supports pagination, category filtering, price range, status, rating filters and multiple sort options
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Products list with pagination info
 */
const getAllProducts = async (req, res) => {
  try {
    // Create cache key based on query parameters
    const cacheKey = `products:${JSON.stringify(req.query)}`;
    
    // Try to get from cache first
    let cachedResult = cacheService.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const categories = req.query.categories ? req.query.categories.split(',') : null;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
    const status = req.query.status;
    const minRating = req.query.minRating ? parseFloat(req.query.minRating) : null;
    const sortBy = req.query.sortBy || 'newest';
    const populateCreator = req.query.populate === 'creator'; // Support lazy loading of creator
    
    // Build filter object
    const filter = {
      status: { $ne: 'Discontinued' }
    };
    
    // Apply category filter (multi-select)
    if (categories && categories.length > 0) {
      filter.category = { $in: categories };
    }
    
    // Apply price range filter
    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};
      if (minPrice !== null) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice !== null) {
        filter.price.$lte = maxPrice;
      }
    }
    
    // Apply status filter
    if (status) {
      filter.status = status;
    }
    
    // Apply rating filter
    if (minRating !== null) {
      filter.averageRating = { $gte: minRating };
    }
    
    // Build sort object
    let sort = {};
    
    switch (sortBy) {
      case 'popularity':
        sort.views = -1;
        break;
      case 'priceLowHigh':
        sort.price = 1;
        break;
      case 'priceHighLow':
        sort.price = -1;
        break;
      case 'endingSoon':
        sort.deadline = 1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'highestRated':
        sort.averageRating = -1;
        break;
      default:
        sort.createdAt = -1;
    }
    
    // Build product query
    let productQuery = ProductConcept.find(filter).sort(sort).skip(skip).limit(limit);
    
    // Conditionally populate creator if requested
    if (populateCreator) {
      productQuery = productQuery.populate('creator', 'name profileImage bio role isVerified');
    }
    
    const products = await productQuery;
    const total = await ProductConcept.countDocuments(filter);
    
    const result = {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
    
    // Cache result for 5 minutes
    cacheService.set(cacheKey, result, 5 * 60 * 1000);
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get featured products
 * Returns products marked as featured with pagination support
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Featured products list with pagination info
 */
const getFeaturedProducts = async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const populateCreator = req.query.populate === 'creator'; // Support lazy loading of creator
    
    let productQuery = ProductConcept.find({ isFeatured: true, status: { $ne: 'Discontinued' } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    // Conditionally populate creator if requested
    if (populateCreator) {
      productQuery = productQuery.populate('creator', 'name profileImage bio role isVerified');
    }
    
    const products = await productQuery;
    const total = await ProductConcept.countDocuments({ isFeatured: true, status: { $ne: 'Discontinued' } });
    
    res.status(200).json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get trending products
 * Returns products with most views in the last 7 days
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Trending products list with pagination info
 */
const getTrendingProducts = async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const populateCreator = req.query.populate === 'creator'; // Support lazy loading of creator
    
    // Trending products are those with most views in the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    let productQuery = ProductConcept.find({ 
      status: { $ne: 'Discontinued' },
      createdAt: { $gte: oneWeekAgo }
    })
      .sort({ views: -1 })
      .skip(skip)
      .limit(limit);
      
    // Conditionally populate creator if requested
    if (populateCreator) {
      productQuery = productQuery.populate('creator', 'name profileImage bio role isVerified');
    }
    
    const products = await productQuery;
    const total = await ProductConcept.countDocuments({ 
      status: { $ne: 'Discontinued' },
      createdAt: { $gte: oneWeekAgo }
    });
    
    res.status(200).json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Search products with text indexes and highlighting
 * Supports text search with category filtering, price range, status and rating filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Search results with pagination info
 */
const searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    const category = req.query.category;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
    const status = req.query.status;
    const rating = req.query.rating ? parseFloat(req.query.rating) : null;
    const sort = req.query.sort || 'newest';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const populateCreator = req.query.populate === 'creator'; // Support lazy loading of creator
    
    // Build filter object
    let filter = {
      status: { $ne: 'Discontinued' }
    };
    
    // Apply text search if query exists
    if (query) {
      filter.$text = { $search: query };
    }
    
    // Apply category filter
    if (category) {
      filter.category = category;
    }
    
    // Apply price range filter
    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};
      if (minPrice !== null) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice !== null) {
        filter.price.$lte = maxPrice;
      }
    }
    
    // Apply status filter
    if (status) {
      filter.status = status;
    }
    
    // Apply rating filter (4+ stars, 3+ stars, etc.)
    if (rating !== null) {
      filter.averageRating = { $gte: rating };
    }
    
    // Build sort object
    let sortObj = {};
    
    switch (sort) {
      case 'popularity':
        sortObj = { views: -1 };
        break;
      case 'price':
        sortObj = { price: 1 };
        break;
      case 'deadline':
        sortObj = { deadline: 1 };
        break;
      case 'date':
        sortObj = { createdAt: -1 };
        break;
      case 'rating':
        sortObj = { averageRating: -1 };
        break;
      default:
        // Default sort by relevance if there's a text search, otherwise by newest
        sortObj = query ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
    }
    
    // Build product query
    let productQuery = ProductConcept.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
    
    // Include text score for highlighting if there's a text search
    if (query) {
      productQuery = productQuery.select({ score: { $meta: 'textScore' } });
    }
    
    // Conditionally populate creator if requested
    if (populateCreator) {
      productQuery = productQuery.populate('creator', 'name profileImage bio role isVerified');
    }
    
    const products = await productQuery;
    const total = await ProductConcept.countDocuments(filter);
    
    // Add highlighting information to products if there's a text search
    let highlightedProducts = products;
    if (query) {
      highlightedProducts = products.map(product => {
        return {
          ...product.toObject(),
          highlight: {
            title: product.title.toLowerCase().includes(query.toLowerCase()) ? product.title : '',
            description: product.description.toLowerCase().includes(query.toLowerCase()) ? product.description : '',
            tags: product.tags.filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
          }
        };
      });
    }
    
    res.status(200).json({
      products: highlightedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    // Check if we should populate the creator relationship
    const populateCreator = req.query.populate === 'creator';
    
    let productQuery = ProductConcept.findById(req.params.id);
    
    // Conditionally populate creator if requested
    if (populateCreator) {
      productQuery = productQuery.populate('creator', 'name profileImage bio role isVerified');
    }
    
    const product = await productQuery;
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const product = new ProductConcept({
      ...req.body,
      creator: req.user._id
    });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const product = await ProductConcept.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user is the creator or admin
    if (product.creator.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }
    
    // Update allowed fields
    const allowedUpdates = [
      'title', 'description', 'detailedDescription', 'price', 
      'fundingGoal', 'deadline', 'category', 'tags', 'isFeatured'
    ];
    
    allowedUpdates.forEach(update => {
      if (req.body[update] !== undefined) {
        product[update] = req.body[update];
      }
    });
    
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await ProductConcept.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user is the creator or admin
    if (product.creator.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    await product.remove();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload product images
const uploadProductImages = async (req, res) => {
  try {
    // Files are processed by multer middleware
    // req.files contains the uploaded files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Extract file information
    const images = req.files.map(file => ({
      original: file.path,
      thumbnail: file.thumbnail || null,
      filename: file.filename,
      size: file.size
    }));

    res.status(200).json({ 
      message: 'Product images uploaded successfully',
      images 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/unlike product
const likeProduct = async (req, res) => {
  try {
    const product = await ProductConcept.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // In a real implementation, we would track which users liked the product
    // For now, we'll just increment the likes count
    product.likes += 1;
    await product.save();
    
    res.json({ message: 'Product liked', likes: product.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment view count
const viewProduct = async (req, res) => {
  try {
    const product = await ProductConcept.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'View count incremented', views: product.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};