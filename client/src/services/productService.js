import api from './api';

// Simple in-memory cache for featured and trending products
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const productService = {
  // Get all products with optional filters
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get a single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create a new product (creator only)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update a product (creator/admin only)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete a product (creator/admin only)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get products by creator
  getProductsByCreator: async (creatorId, params = {}) => {
    const response = await api.get(`/products/creator/${creatorId}`, { params });
    return response.data;
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const response = await api.get('/products/search', { 
      params: { 
        q: query,
        ...params
      } 
    });
    return response.data;
  },

  // Get featured products with caching
  getFeaturedProducts: async (params = {}) => {
    try {
      const cacheKey = `featured:${JSON.stringify(params)}`;
      const cached = cache.get(cacheKey);
      
      // Check if we have valid cached data
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
      
      const response = await api.get('/products/featured', { params });
      const data = response.data;
      
      // Cache the data
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get trending products with caching
  getTrendingProducts: async (params = {}) => {
    try {
      const cacheKey = `trending:${JSON.stringify(params)}`;
      const cached = cache.get(cacheKey);
      
      // Check if we have valid cached data
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
      
      const response = await api.get('/products/trending', { params });
      const data = response.data;
      
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

export default productService;