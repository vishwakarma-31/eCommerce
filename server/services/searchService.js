const ProductConcept = require('../models/ProductConcept');
const Search = require('../models/Search');

/**
 * Search products with advanced filters
 * @param {Object} queryParams - Search parameters
 * @param {String} userId - User ID (optional)
 * @returns {Object} Search results with pagination
 */
const searchProducts = async (queryParams, userId = null) => {
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
  } = queryParams;

  // Build filter object
  let filter = {
    status: { $in: ['Marketplace', 'Active'] }
  };

  // Add text search with fuzzy matching
  if (q) {
    // Create regex pattern for fuzzy search
    const fuzzyQuery = q.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    
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
  if (queryParams.newArrivals === 'true') {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filter.createdAt = { $gte: thirtyDaysAgo };
  }

  // Add free shipping filter
  if (queryParams.freeShipping === 'true') {
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
  if (q && userId) {
    await Search.recordSearch(q, userId, products.length);
  } else if (q) {
    await Search.recordSearch(q, null, products.length);
  }

  return {
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get search suggestions/autocomplete
 * @param {String} query - Search query
 * @param {Number} limit - Number of suggestions to return
 * @returns {Array} Array of suggestions
 */
const getSearchSuggestions = async (query, limit = 10) => {
  if (!query) {
    return [];
  }

  // Create regex pattern for partial matching
  const regex = new RegExp(query, 'i');

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
    if (!seen.has(product.title) && product.title.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push(product.title);
      seen.add(product.title);
    }
    
    // Add brand
    if (product.brand && !seen.has(product.brand) && product.brand.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push(product.brand);
      seen.add(product.brand);
    }
    
    // Add category
    if (product.category && !seen.has(product.category) && product.category.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push(product.category);
      seen.add(product.category);
    }
  });

  return suggestions.slice(0, Number(limit));
};

/**
 * Get popular searches
 * @param {Number} limit - Number of popular searches to return
 * @returns {Array} Array of popular searches
 */
const getPopularSearches = async (limit = 10) => {
  return await Search.getPopularSearches(Number(limit));
};

/**
 * Get user search history
 * @param {String} userId - User ID
 * @param {Number} limit - Number of history items to return
 * @returns {Array} Array of search history items
 */
const getUserSearchHistory = async (userId, limit = 10) => {
  return await Search.getUserSearchHistory(userId, Number(limit));
};

module.exports = {
  searchProducts,
  getSearchSuggestions,
  getPopularSearches,
  getUserSearchHistory
};