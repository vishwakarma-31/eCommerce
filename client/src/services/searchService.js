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
      
      const response = await API.get(`/search?${searchParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get search suggestions/autocomplete
   * @param {String} query - Search query
   * @param {Number} limit - Number of suggestions to return
   * @returns {Promise} - Array of suggestions
   */
  getSearchSuggestions: async (query, limit = 10) => {
    try {
      const searchParams = new URLSearchParams();
      if (query) searchParams.append('q', query);
      if (limit) searchParams.append('limit', limit);
      
      const response = await API.get(`/search/suggestions?${searchParams.toString()}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get popular searches
   * @param {Number} limit - Number of popular searches to return
   * @returns {Promise} - Array of popular searches
   */
  getPopularSearches: async (limit = 10) => {
    try {
      const searchParams = new URLSearchParams();
      if (limit) searchParams.append('limit', limit);
      
      const response = await API.get(`/search/popular?${searchParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get user search history
   * @param {Number} limit - Number of history items to return
   * @returns {Promise} - Array of search history items
   */
  getUserSearchHistory: async (limit = 10) => {
    try {
      const searchParams = new URLSearchParams();
      if (limit) searchParams.append('limit', limit);
      
      const response = await API.get(`/search/history?${searchParams.toString()}`);
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
        brands: [
          'Apple',
          'Samsung',
          'Nike',
          'Adidas',
          'Sony',
          'Microsoft',
          'Amazon',
          'Google',
          'Tesla',
          'LG'
        ],
        colors: [
          'Black',
          'White',
          'Red',
          'Blue',
          'Green',
          'Yellow',
          'Purple',
          'Pink',
          'Orange',
          'Brown'
        ],
        sizes: [
          'XS',
          'S',
          'M',
          'L',
          'XL',
          'XXL'
        ],
        ratings: [
          { value: 4, label: '4+ stars' },
          { value: 3, label: '3+ stars' },
          { value: 2, label: '2+ stars' },
          { value: 1, label: '1+ stars' }
        ],
        sortOptions: [
          { value: 'relevance', label: 'Relevance' },
          { value: 'priceLowHigh', label: 'Price: Low to High' },
          { value: 'priceHighLow', label: 'Price: High to Low' },
          { value: 'rating', label: 'Average Rating' },
          { value: 'newest', label: 'Newest First' },
          { value: 'bestSelling', label: 'Best Selling' },
          { value: 'mostReviewed', label: 'Most Reviewed' }
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