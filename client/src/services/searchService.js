import API from './api';

// Simple in-memory cache for filter options
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const searchService = {
  /**
   * Search products with all filter options
   * @param {Object} params - Search parameters
   * @returns {Promise} - Search results
   */
  searchProducts: async (params) => {
    try {
      const {
        query,
        categories,
        minPrice,
        maxPrice,
        status,
        minRating,
        sortBy,
        page,
        limit
      } = params;
      
      const searchParams = new URLSearchParams();
      
      if (query) searchParams.append('q', query);
      if (categories && categories.length > 0) searchParams.append('categories', categories.join(','));
      if (minPrice !== null && minPrice !== undefined) searchParams.append('minPrice', minPrice);
      if (maxPrice !== null && maxPrice !== undefined) searchParams.append('maxPrice', maxPrice);
      if (status) searchParams.append('status', status);
      if (minRating !== null && minRating !== undefined) searchParams.append('minRating', minRating);
      if (sortBy) searchParams.append('sortBy', sortBy);
      if (page) searchParams.append('page', page);
      if (limit) searchParams.append('limit', limit);
      
      const response = await API.get(`/products/search?${searchParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get all products with filtering and sorting
   * @param {Object} params - Filter and sort parameters
   * @returns {Promise} - Products list
   */
  getProducts: async (params) => {
    try {
      const {
        categories,
        minPrice,
        maxPrice,
        status,
        minRating,
        sortBy,
        page,
        limit
      } = params;
      
      const searchParams = new URLSearchParams();
      
      if (categories && categories.length > 0) searchParams.append('categories', categories.join(','));
      if (minPrice !== null && minPrice !== undefined) searchParams.append('minPrice', minPrice);
      if (maxPrice !== null && maxPrice !== undefined) searchParams.append('maxPrice', maxPrice);
      if (status) searchParams.append('status', status);
      if (minRating !== null && minRating !== undefined) searchParams.append('minRating', minRating);
      if (sortBy) searchParams.append('sortBy', sortBy);
      if (page) searchParams.append('page', page);
      if (limit) searchParams.append('limit', limit);
      
      const response = await API.get(`/products?${searchParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get filter options for products with caching
   * @returns {Promise} - Filter options
   */
  getFilterOptions: async () => {
    try {
      const cacheKey = 'filterOptions';
      const cached = cache.get(cacheKey);
      
      // Check if we have valid cached data
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
      
      // In a real implementation, this would fetch dynamic filter options
      // For now, we'll return the static options as specified in Section 11
      const data = {
        categories: [
          'Electronics',
          'Home & Garden',
          'Fashion',
          'Toys & Games',
          'Sports & Outdoors',
          'Health & Beauty',
          'Books & Media',
          'Automotive',
          'Food & Beverage',
          'Art & Crafts'
        ],
        statuses: [
          'Funding',
          'Marketplace'
        ],
        ratings: [
          { value: 4, label: '4+ stars' },
          { value: 3, label: '3+ stars' },
          { value: 2, label: '2+ stars' },
          { value: 1, label: '1+ stars' }
        ],
        sortOptions: [
          { value: 'popularity', label: 'Most popular' },
          { value: 'priceLowHigh', label: 'Price: Low to High' },
          { value: 'priceHighLow', label: 'Price: High to Low' },
          { value: 'endingSoon', label: 'Ending soon' },
          { value: 'newest', label: 'Newest first' },
          { value: 'highestRated', label: 'Highest rated' }
        ]
      };
      
      // Cache the data
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default searchService;