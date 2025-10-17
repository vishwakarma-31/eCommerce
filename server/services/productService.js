const ProductConcept = require('../models/ProductConcept');
const { CustomError } = require('../utils/customErrors');

/**
 * Get all products with filtering, sorting, and pagination
 * @param {Object} query - Query parameters
 * @returns {Object} Products with pagination info
 */
const getAllProducts = async (query) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      rating,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isFeatured,
      isNewArrival,
      isBestSeller,
      status,
      search
    } = query;

    // Build filter object
    let filter = {};

    // Add category filter
    if (category) {
      filter.category = category;
    }

    // Add subcategory filter
    if (subcategory) {
      filter.subcategory = subcategory;
    }

    // Add brand filter
    if (brand) {
      filter.brand = brand;
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Add rating filter
    if (rating) {
      filter.averageRating = { $gte: Number(rating) };
    }

    // Add featured filter
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    // Add new arrival filter
    if (isNewArrival !== undefined) {
      filter.isNewArrival = isNewArrival === 'true';
    }

    // Add best seller filter
    if (isBestSeller !== undefined) {
      filter.isBestSeller = isBestSeller === 'true';
    }

    // Add status filter
    if (status) {
      filter.status = status;
    }

    // Add search filter
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by newest
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with optimizations
    const products = await ProductConcept.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-reviews -comments -detailedDescription') // Exclude heavy fields
      .populate('creator', 'name profileImage') // Only select needed fields
      .lean(); // Use lean() for better performance

    // Get total count for pagination
    const total = await ProductConcept.countDocuments(filter);

    return {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new CustomError('Failed to fetch products', 500);
  }
};

/**
 * Get a single product by ID
 * @param {String} productId - Product ID
 * @returns {Object} Product object
 */
const getProductById = async (productId) => {
  try {
    const product = await ProductConcept.findById(productId)
      .populate('creator', 'name profileImage bio')
      .populate({
        path: 'reviews',
        select: 'rating comment author createdAt',
        populate: {
          path: 'author',
          select: 'name profileImage'
        }
      })
      .lean(); // Use lean() for better performance

    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    // Increment view count (separate query to avoid performance impact)
    ProductConcept.updateOne({ _id: productId }, { $inc: { views: 1 } })
      .catch(err => console.error('Failed to increment view count:', err));

    return product;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new CustomError('Invalid product ID', 400);
    }
    throw error;
  }
};

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @param {String} creatorId - Creator user ID
 * @returns {Object} Created product
 */
const createProduct = async (productData, creatorId) => {
  try {
    // Add creator to product data
    productData.creator = creatorId;

    // Generate slug from title
    productData.slug = productData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Calculate total stock from variants if provided
    if (productData.variants && productData.variants.length > 0) {
      productData.totalStock = productData.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
    } else {
      productData.totalStock = productData.stockQuantity || 0;
    }

    // Set stock status based on total stock
    if (productData.totalStock === 0) {
      productData.stockStatus = 'Out of Stock';
    } else if (productData.totalStock < 10) {
      productData.stockStatus = 'Low Stock';
    } else {
      productData.stockStatus = 'In Stock';
    }

    // Calculate discount percentage if discount price is provided
    if (productData.discountPrice && productData.price) {
      productData.discountPercentage = Math.round(((productData.price - productData.discountPrice) / productData.price) * 100);
    }

    const product = await ProductConcept.create(productData);
    return product;
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new CustomError('Invalid product data', 400);
    }
    throw new CustomError('Failed to create product', 500);
  }
};

/**
 * Update a product
 * @param {String} productId - Product ID
 * @param {Object} updateData - Update data
 * @param {String} userId - User ID
 * @param {String} userRole - User role
 * @returns {Object} Updated product
 */
const updateProduct = async (productId, updateData, userId, userRole) => {
  try {
    // Find the product
    const product = await ProductConcept.findById(productId);
    
    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    // Check if user is authorized to update (creator or admin)
    if (product.creator.toString() !== userId && userRole !== 'Admin') {
      throw new CustomError('Not authorized to update this product', 403);
    }

    // Update slug if title is changed
    if (updateData.title && updateData.title !== product.title) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Recalculate total stock if variants are updated
    if (updateData.variants) {
      updateData.totalStock = updateData.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
    }

    // Update stock status based on total stock
    if (updateData.totalStock !== undefined) {
      if (updateData.totalStock === 0) {
        updateData.stockStatus = 'Out of Stock';
      } else if (updateData.totalStock < 10) {
        updateData.stockStatus = 'Low Stock';
      } else {
        updateData.stockStatus = 'In Stock';
      }
    }

    // Recalculate discount percentage if prices are updated
    if (updateData.discountPrice !== undefined || updateData.price !== undefined) {
      const price = updateData.price !== undefined ? updateData.price : product.price;
      const discountPrice = updateData.discountPrice !== undefined ? updateData.discountPrice : product.discountPrice;
      
      if (discountPrice && price) {
        updateData.discountPercentage = Math.round(((price - discountPrice) / price) * 100);
      }
    }

    // Update the product
    const updatedProduct = await ProductConcept.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    return updatedProduct;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new CustomError('Invalid product ID', 400);
    }
    if (error.name === 'ValidationError') {
      throw new CustomError('Invalid product data', 400);
    }
    throw error;
  }
};

/**
 * Delete a product
 * @param {String} productId - Product ID
 * @param {String} userId - User ID
 * @param {String} userRole - User role
 * @returns {Object} Deletion result
 */
const deleteProduct = async (productId, userId, userRole) => {
  try {
    // Find the product
    const product = await ProductConcept.findById(productId);
    
    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    // Only admin can delete products
    if (userRole !== 'Admin') {
      throw new CustomError('Not authorized to delete this product', 403);
    }

    // Delete the product
    await product.remove();

    return { message: 'Product deleted successfully' };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new CustomError('Invalid product ID', 400);
    }
    throw error;
  }
};

/**
 * Get featured products
 * @param {Number} limit - Number of products to return
 * @returns {Array} Featured products
 */
const getFeaturedProducts = async (limit = 8) => {
  try {
    const products = await ProductConcept.find({ 
      isFeatured: true, 
      status: { $in: ['Marketplace', 'Active'] } 
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-reviews -comments -detailedDescription') // Exclude heavy fields
      .populate('creator', 'name profileImage')
      .lean(); // Use lean() for better performance

    return products;
  } catch (error) {
    throw new CustomError('Failed to fetch featured products', 500);
  }
};

/**
 * Get new arrival products
 * @param {Number} limit - Number of products to return
 * @returns {Array} New arrival products
 */
const getNewArrivalProducts = async (limit = 8) => {
  try {
    const products = await ProductConcept.find({ 
      isNewArrival: true, 
      status: { $in: ['Marketplace', 'Active'] } 
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-reviews -comments -detailedDescription') // Exclude heavy fields
      .populate('creator', 'name profileImage')
      .lean(); // Use lean() for better performance

    return products;
  } catch (error) {
    throw new CustomError('Failed to fetch new arrival products', 500);
  }
};

/**
 * Get best seller products
 * @param {Number} limit - Number of products to return
 * @returns {Array} Best seller products
 */
const getBestSellerProducts = async (limit = 8) => {
  try {
    const products = await ProductConcept.find({ 
      isBestSeller: true, 
      status: { $in: ['Marketplace', 'Active'] } 
    })
      .sort({ sales: -1 })
      .limit(limit)
      .select('-reviews -comments -detailedDescription') // Exclude heavy fields
      .populate('creator', 'name profileImage')
      .lean(); // Use lean() for better performance

    return products;
  } catch (error) {
    throw new CustomError('Failed to fetch best seller products', 500);
  }
};



/**
 * Search products with advanced filters
 * @param {Object} query - Search query parameters
 * @returns {Object} Search results with pagination
 */
const searchProducts = async (query) => {
  try {
    const {
      q,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      sortBy = 'relevance',
      page = 1,
      limit = 12
    } = query;

    // Build filter object
    let filter = {
      status: { $in: ['Marketplace', 'Active'] }
    };

    // Add text search
    if (q) {
      filter.$text = { $search: q };
    }

    // Add category filter
    if (category) {
      filter.category = category;
    }

    // Add brand filter
    if (brand) {
      filter.brand = brand;
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Add rating filter
    if (rating) {
      filter.averageRating = { $gte: Number(rating) };
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'priceLowHigh':
        sort.price = 1;
        break;
      case 'priceHighLow':
        sort.price = -1;
        break;
      case 'rating':
        sort.averageRating = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'popularity':
        sort.sales = -1;
        break;
      default:
        // Sort by relevance if text search is used
        if (q) {
          sort.score = { $meta: 'textScore' };
        } else {
          sort.createdAt = -1;
        }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with optimizations
    let productQuery = ProductConcept.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-reviews -comments -detailedDescription') // Exclude heavy fields
      .populate('creator', 'name profileImage'); // Only select needed fields

    // Include text score for relevance sorting
    if (q) {
      productQuery = productQuery.select({ score: { $meta: 'textScore' } });
    }

    // Use lean() for better performance
    const products = await productQuery.lean();

    // Get total count for pagination
    const total = await ProductConcept.countDocuments(filter);

    return {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new CustomError('Failed to search products', 500);
  }
};

/**
 * Add images to product
 * @param {String} productId - Product ID
 * @param {Array} imageUrls - Array of image URLs
 * @param {String} userId - User ID
 * @param {String} userRole - User role
 * @returns {Object} Updated product
 */
const addProductImages = async (productId, imageUrls, userId, userRole) => {
  try {
    // Find the product
    const product = await ProductConcept.findById(productId);
    
    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    // Check if user is authorized to update (creator or admin)
    if (product.creator.toString() !== userId && userRole !== 'Admin') {
      throw new CustomError('Not authorized to update this product', 403);
    }

    // Add images to product
    product.images = [...product.images, ...imageUrls];
    await product.save();

    return product;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new CustomError('Invalid product ID', 400);
    }
    throw error;
  }
};

/**
 * Remove image from product
 * @param {String} productId - Product ID
 * @param {String} imageId - Image ID/URL
 * @param {String} userId - User ID
 * @param {String} userRole - User role
 * @returns {Object} Updated product
 */
const removeProductImage = async (productId, imageId, userId, userRole) => {
  try {
    // Find the product
    const product = await ProductConcept.findById(productId);
    
    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    // Check if user is authorized to update (creator or admin)
    if (product.creator.toString() !== userId && userRole !== 'Admin') {
      throw new CustomError('Not authorized to update this product', 403);
    }

    // Remove image from product
    product.images = product.images.filter(image => image !== imageId);
    await product.save();

    return product;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new CustomError('Invalid product ID', 400);
    }
    throw error;
  }
};

/**
 * Get related products based on category, price range, and tags
 * @param {String} productId - Product ID
 * @param {Object} options - Options for related products
 * @returns {Array} Related products
 */
const getRelatedProducts = async (productId, options = {}) => {
  try {
    const product = await ProductConcept.findById(productId);
    
    if (!product) {
      throw new CustomError('Product not found', 404);
    }
    
    const limit = options.limit || 4;
    const priceRange = options.priceRange || 0.2; // 20% price range
    
    // Calculate price range
    const minPrice = product.price * (1 - priceRange);
    const maxPrice = product.price * (1 + priceRange);
    
    // Build query for related products
    const query = {
      _id: { $ne: productId }, // Exclude the current product
      status: { $in: ['Marketplace', 'Active'] },
      category: product.category
    };
    
    // Add price range filter
    query.price = { $gte: minPrice, $lte: maxPrice };
    
    // Add tag filter if product has tags
    if (product.tags && product.tags.length > 0) {
      query.tags = { $in: product.tags };
    }
    
    const relatedProducts = await ProductConcept.find(query)
      .limit(limit)
      .select('-reviews -comments -detailedDescription')
      .populate('creator', 'name profileImage')
      .lean();
    
    return relatedProducts;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new CustomError('Invalid product ID', 400);
    }
    throw error;
  }
};

/**
 * Get related products with enhanced algorithm including frequently bought together
 * @param {String} productId - Product ID
 * @param {Object} options - Options for related products
 * @returns {Array} Related products
 */
const getEnhancedRelatedProducts = async (productId, options = {}) => {
  try {
    const product = await ProductConcept.findById(productId);
    
    if (!product) {
      throw new CustomError('Product not found', 404);
    }
    
    const limit = options.limit || 4;
    const priceRange = options.priceRange || 0.2; // 20% price range
    
    // Calculate price range
    const minPrice = product.price * (1 - priceRange);
    const maxPrice = product.price * (1 + priceRange);
    
    // Build base query for related products
    const baseQuery = {
      _id: { $ne: productId }, // Exclude the current product
      status: { $in: ['Marketplace', 'Active'] }
    };
    
    // Get products from same category
    const categoryQuery = {
      ...baseQuery,
      category: product.category
    };
    
    // Add price range filter
    categoryQuery.price = { $gte: minPrice, $lte: maxPrice };
    
    // Add tag filter if product has tags
    if (product.tags && product.tags.length > 0) {
      categoryQuery.tags = { $in: product.tags };
    }
    
    // Get products with similar price range
    const priceQuery = {
      ...baseQuery,
      price: { $gte: minPrice, $lte: maxPrice }
    };
    
    // Get products with similar tags
    let tagQuery = {};
    if (product.tags && product.tags.length > 0) {
      tagQuery = {
        ...baseQuery,
        tags: { $in: product.tags }
      };
    }
    
    // Get frequently bought together products (mock implementation)
    // In a real implementation, this would use order history data
    const frequentlyBoughtQuery = {
      ...baseQuery,
      category: product.category
    };
    
    // Execute all queries
    const [categoryProducts, priceProducts, tagProducts, frequentlyBoughtProducts] = await Promise.all([
      ProductConcept.find(categoryQuery)
        .limit(Math.ceil(limit / 2))
        .select('-reviews -comments -detailedDescription')
        .populate('creator', 'name profileImage')
        .lean(),
      ProductConcept.find(priceQuery)
        .limit(Math.ceil(limit / 3))
        .select('-reviews -comments -detailedDescription')
        .populate('creator', 'name profileImage')
        .lean(),
      tagQuery.tags ? ProductConcept.find(tagQuery)
        .limit(Math.ceil(limit / 3))
        .select('-reviews -comments -detailedDescription')
        .populate('creator', 'name profileImage')
        .lean() : [],
      ProductConcept.find(frequentlyBoughtQuery)
        .limit(Math.ceil(limit / 2))
        .select('-reviews -comments -detailedDescription')
        .populate('creator', 'name profileImage')
        .lean()
    ]);
    
    // Combine all products and remove duplicates
    const allProducts = [
      ...categoryProducts,
      ...priceProducts,
      ...tagProducts,
      ...frequentlyBoughtProducts
    ];
    
    // Remove duplicates by ID
    const uniqueProducts = Array.from(
      new Map(allProducts.map(product => [product._id.toString(), product])).values()
    );
    
    // Sort by relevance (popularity score, ratings, sales)
    uniqueProducts.sort((a, b) => {
      // Sort by popularity score first
      if (b.popularityScore !== a.popularityScore) {
        return b.popularityScore - a.popularityScore;
      }
      // Then by average rating
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }
      // Then by sales count
      return b.sales - a.sales;
    });
    
    // Return limited results
    return uniqueProducts.slice(0, limit);
  } catch (error) {
    if (error.name === 'CastError') {
      throw new CustomError('Invalid product ID', 400);
    }
    throw error;
  }
};

// Add new service methods for Q&A functionality
/**
 * Add a question to a product
 * @param {String} productId - Product ID
 * @param {String} userId - User ID
 * @param {String} question - Question text
 * @returns {Object} Updated product
 */
const addQuestion = async (productId, userId, question) => {
  try {
    const product = await ProductConcept.findByIdAndUpdate(
      productId,
      {
        $push: {
          questions: {
            user: userId,
            question: question,
            createdAt: new Date()
          }
        }
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('questions.user', 'name profileImage');
    
    if (!product) {
      throw new CustomError('Product not found', 404);
    }
    
    return product;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new CustomError('Invalid product ID', 400);
    }
    throw error;
  }
};

/**
 * Add an answer to a product question
 * @param {String} productId - Product ID
 * @param {String} questionId - Question ID
 * @param {String} userId - User ID
 * @param {String} answer - Answer text
 * @param {Boolean} isAdmin - Whether the user is an admin
 * @returns {Object} Updated product
 */
const addAnswer = async (productId, questionId, userId, answer, isAdmin = false) => {
  try {
    const product = await ProductConcept.findById(productId);
    
    if (!product) {
      throw new CustomError('Product not found', 404);
    }
    
    // Find the question
    const question = product.questions.id(questionId);
    if (!question) {
      throw new CustomError('Question not found', 404);
    }
    
    // Add the answer
    question.answers.push({
      user: userId,
      answer: answer,
      isAdmin: isAdmin,
      createdAt: new Date()
    });
    
    question.isAnswered = true;
    
    await product.save();
    
    // Populate user info
    await product.populate('questions.user questions.answers.user', 'name profileImage');
    
    return product;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new CustomError('Invalid product or question ID', 400);
    }
    throw error;
  }
};

/**
 * Upvote a question
 * @param {String} productId - Product ID
 * @param {String} questionId - Question ID
 * @param {String} userId - User ID
 * @returns {Object} Updated product
 */
const upvoteQuestion = async (productId, questionId, userId) => {
  try {
    const product = await ProductConcept.findById(productId);
    
    if (!product) {
      throw new CustomError('Product not found', 404);
    }
    
    // Find the question
    const question = product.questions.id(questionId);
    if (!question) {
      throw new CustomError('Question not found', 404);
    }
    
    // Check if user has already upvoted
    const hasUpvoted = question.upvotedBy.includes(userId);
    
    if (hasUpvoted) {
      // Remove upvote
      question.upvotedBy.pull(userId);
      question.upvotes = Math.max(0, question.upvotes - 1);
    } else {
      // Add upvote
      question.upvotedBy.push(userId);
      question.upvotes += 1;
    }
    
    await product.save();
    
    // Populate user info
    await product.populate('questions.user questions.answers.user', 'name profileImage');
    
    return product;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new CustomError('Invalid product or question ID', 400);
    }
    throw error;
  }
};

/**
 * Upvote an answer
 * @param {String} productId - Product ID
 * @param {String} questionId - Question ID
 * @param {String} answerId - Answer ID
 * @param {String} userId - User ID
 * @returns {Object} Updated product
 */
const upvoteAnswer = async (productId, questionId, answerId, userId) => {
  try {
    const product = await ProductConcept.findById(productId);
    
    if (!product) {
      throw new CustomError('Product not found', 404);
    }
    
    // Find the question
    const question = product.questions.id(questionId);
    if (!question) {
      throw new CustomError('Question not found', 404);
    }
    
    // Find the answer
    const answer = question.answers.id(answerId);
    if (!answer) {
      throw new CustomError('Answer not found', 404);
    }
    
    // Check if user has already upvoted
    const hasUpvoted = answer.upvotedBy.includes(userId);
    
    if (hasUpvoted) {
      // Remove upvote
      answer.upvotedBy.pull(userId);
      answer.upvotes = Math.max(0, answer.upvotes - 1);
    } else {
      // Add upvote
      answer.upvotedBy.push(userId);
      answer.upvotes += 1;
    }
    
    await product.save();
    
    // Populate user info
    await product.populate('questions.user questions.answers.user', 'name profileImage');
    
    return product;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new CustomError('Invalid product, question, or answer ID', 400);
    }
    throw error;
  }
};

// Export all methods
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivalProducts,
  getBestSellerProducts,
  getRelatedProducts,
  getEnhancedRelatedProducts,
  searchProducts,
  addProductImages,
  removeProductImage,
  addQuestion,
  addAnswer,
  upvoteQuestion,
  upvoteAnswer
};