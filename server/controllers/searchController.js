const ProductConcept = require('../models/ProductConcept');
const Search = require('../models/Search');
const { CustomError } = require('../utils/customErrors');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Main search endpoint with all filters
 * @route   GET /api/search
 * @access  Public
 */
const searchProducts = asyncHandler(async (req, res, next) => {
  try {
    const {
      q,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      rating,
      availability,
      discount,
      color,
      size,
      sortBy = 'relevance',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    let filter = {
      status: { $in: ['Marketplace', 'Active'] }
    };

    // Add text search with fuzzy matching
    if (q) {
      // Create regex pattern for fuzzy search
      const fuzzyQuery = q.replace(/[^a-zA-Z0-9 ]/g, '').trim();
      const regexPattern = fuzzyQuery.split(/\s+/).map(word => 
        `(?=.*${word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`
      ).join('');
      
      filter.$or = [
        { title: { $regex: fuzzyQuery, $options: 'i' } },
        { description: { $regex: fuzzyQuery, $options: 'i' } },
        { tags: { $regex: fuzzyQuery, $options: 'i' } },
        { brand: { $regex: fuzzyQuery, $options: 'i' } },
        { category: { $regex: fuzzyQuery, $options: 'i' } }
      ];
    }

    // Add category filter
    if (category) {
      if (Array.isArray(category)) {
        filter.category = { $in: category };
      } else {
        filter.category = category;
      }
    }

    // Add subcategory filter
    if (subcategory) {
      if (Array.isArray(subcategory)) {
        filter.subcategory = { $in: subcategory };
      } else {
        filter.subcategory = subcategory;
      }
    }

    // Add brand filter
    if (brand) {
      if (Array.isArray(brand)) {
        filter.brand = { $in: brand };
      } else {
        filter.brand = brand;
      }
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

    // Add availability filter
    if (availability) {
      if (availability === 'inStock') {
        filter.stockStatus = 'In Stock';
      } else if (availability === 'outOfStock') {
        filter.stockStatus = 'Out of Stock';
      }
    }

    // Add discount filter
    if (discount) {
      if (discount === 'onSale') {
        filter.isOnSale = true;
      } else if (discount === 'clearance') {
        filter.discountPercentage = { $gte: 50 };
      }
    }

    // Add color filter for variants
    if (color) {
      if (Array.isArray(color)) {
        filter['variants.color'] = { $in: color.map(c => new RegExp(c, 'i')) };
      } else {
        filter['variants.color'] = new RegExp(color, 'i');
      }
    }

    // Add size filter for variants
    if (size) {
      if (Array.isArray(size)) {
        filter['variants.size'] = { $in: size };
      } else {
        filter['variants.size'] = size;
      }
    }

    // Add new arrivals filter (last 30 days)
    if (req.query.newArrivals === 'true') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filter.createdAt = { $gte: thirtyDaysAgo };
    }

    // Add free shipping filter
    if (req.query.freeShipping === 'true') {
      filter.isFreeShipping = true;
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
      case 'bestSelling':
        sort.sales = -1;
        break;
      case 'mostReviewed':
        sort.totalReviews = -1;
        break;
      default:
        // Sort by relevance if text search is used
        if (q) {
          // For text search, we'll sort by a combination of factors
          sort = { 
            sales: -1, 
            averageRating: -1, 
            createdAt: -1 
          };
        } else {
          sort.createdAt = -1;
        }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const products = await ProductConcept.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('creator', 'name profileImage');

    // Get total count for pagination
    const total = await ProductConcept.countDocuments(filter);

    // Record search if user is logged in
    if (q && req.user) {
      await Search.recordSearch(q, req.user._id, products.length);
    } else if (q) {
      await Search.recordSearch(q, null, products.length);
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(new CustomError('Failed to search products', 500));
  }
});

/**
 * @desc    Search autocomplete suggestions
 * @route   GET /api/search/suggestions
 * @access  Public
 */
const getSearchSuggestions = asyncHandler(async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Create regex pattern for partial matching
    const regex = new RegExp(q, 'i');

    // Search for matching products
    const products = await ProductConcept.find({
      $or: [
        { title: regex },
        { brand: regex },
        { category: regex }
      ],
      status: { $in: ['Marketplace', 'Active'] }
    })
    .limit(Number(limit))
    .select('title brand category');

    // Extract unique suggestions
    const suggestions = [];
    const seen = new Set();

    products.forEach(product => {
      // Add product title
      if (!seen.has(product.title) && product.title.toLowerCase().includes(q.toLowerCase())) {
        suggestions.push(product.title);
        seen.add(product.title);
      }
      
      // Add brand
      if (product.brand && !seen.has(product.brand) && product.brand.toLowerCase().includes(q.toLowerCase())) {
        suggestions.push(product.brand);
        seen.add(product.brand);
      }
      
      // Add category
      if (product.category && !seen.has(product.category) && product.category.toLowerCase().includes(q.toLowerCase())) {
        suggestions.push(product.category);
        seen.add(product.category);
      }
    });

    res.status(200).json({
      success: true,
      data: suggestions.slice(0, Number(limit))
    });
  } catch (error) {
    next(new CustomError('Failed to get search suggestions', 500));
  }
});

/**
 * @desc    Get popular searches
 * @route   GET /api/search/popular
 * @access  Public
 */
const getPopularSearches = asyncHandler(async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const popularSearches = await Search.getPopularSearches(Number(limit));
    
    res.status(200).json({
      success: true,
      count: popularSearches.length,
      data: popularSearches
    });
  } catch (error) {
    next(new CustomError('Failed to get popular searches', 500));
  }
});

/**
 * @desc    Get user search history
 * @route   GET /api/search/history
 * @access  Private
 */
const getUserSearchHistory = asyncHandler(async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    if (!req.user) {
      return next(new CustomError('User not authenticated', 401));
    }
    
    const searchHistory = await Search.getUserSearchHistory(req.user._id, Number(limit));
    
    res.status(200).json({
      success: true,
      count: searchHistory.length,
      data: searchHistory
    });
  } catch (error) {
    next(new CustomError('Failed to get search history', 500));
  }
});

module.exports = {
  searchProducts,
  getSearchSuggestions,
  getPopularSearches,
  getUserSearchHistory
};