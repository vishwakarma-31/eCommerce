import API from './api';

const productService = {
  /**
   * Get all products with filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} - Products data
   */
  getProducts: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          searchParams.append(key, params[key]);
        }
      });
      
      const response = await API.get(`/products?${searchParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single product by ID
   * @param {String} id - Product ID
   * @returns {Promise} - Product data
   */
  getProductById: async (id) => {
    try {
      const response = await API.get(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search products
   * @param {Object} params - Search parameters
   * @returns {Promise} - Search results
   */
  searchProducts: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          searchParams.append(key, params[key]);
        }
      });
      
      const response = await API.get(`/products/search?${searchParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get featured products
   * @param {Number} limit - Number of products to return
   * @returns {Promise} - Featured products
   */
  getFeaturedProducts: async (limit = 8) => {
    try {
      const response = await API.get(`/products/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get new arrival products
   * @param {Number} limit - Number of products to return
   * @returns {Promise} - New arrival products
   */
  getNewArrivalProducts: async (limit = 8) => {
    try {
      const response = await API.get(`/products/new-arrivals?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get best seller products
   * @param {Number} limit - Number of products to return
   * @returns {Promise} - Best seller products
   */
  getBestSellerProducts: async (limit = 8) => {
    try {
      const response = await API.get(`/products/best-sellers?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get related products
   * @param {String} productId - Product ID
   * @param {Object} options - Options for related products
   * @returns {Promise} - Related products
   */
  getRelatedProducts: async (productId, options = {}) => {
    try {
      const searchParams = new URLSearchParams();
      
      Object.keys(options).forEach(key => {
        if (options[key] !== undefined && options[key] !== null && options[key] !== '') {
          searchParams.append(key, options[key]);
        }
      });
      
      const response = await API.get(`/products/related/${productId}?${searchParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get filter options for products
   * @returns {Promise} - Filter options
   */
  getFilterOptions: async () => {
    try {
      // In a real implementation, this would fetch dynamic filter options from the server
      // For now, we'll return static options
      return {
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
        materials: [
          'Cotton',
          'Polyester',
          'Leather',
          'Silk',
          'Wool',
          'Denim',
          'Linen',
          'Rayon',
          'Nylon',
          'Spandex'
        ]
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Promise} - Created product
   */
  createProduct: async (productData) => {
    try {
      const response = await API.post('/products', productData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a product
   * @param {String} id - Product ID
   * @param {Object} productData - Product data
   * @returns {Promise} - Updated product
   */
  updateProduct: async (id, productData) => {
    try {
      const response = await API.put(`/products/${id}`, productData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a product
   * @param {String} id - Product ID
   * @returns {Promise} - Deletion result
   */
  deleteProduct: async (id) => {
    try {
      const response = await API.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload product images
   * @param {String} id - Product ID
   * @param {Array} images - Array of image files
   * @returns {Promise} - Updated product
   */
  uploadProductImages: async (id, images) => {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });
      
      const response = await API.post(`/products/${id}/upload-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a product image
   * @param {String} id - Product ID
   * @param {String} imageId - Image ID
   * @returns {Promise} - Updated product
   */
  deleteProductImage: async (id, imageId) => {
    try {
      const response = await API.delete(`/products/${id}/images/${imageId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Add a question to a product
   * @param {String} productId - Product ID
   * @param {String} question - Question text
   * @returns {Promise} - Updated product
   */
  addQuestion: async (productId, question) => {
    try {
      const response = await API.post(`/products/${productId}/questions`, { question });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Add an answer to a product question
   * @param {String} productId - Product ID
   * @param {String} questionId - Question ID
   * @param {String} answer - Answer text
   * @returns {Promise} - Updated product
   */
  addAnswer: async (productId, questionId, answer) => {
    try {
      const response = await API.post(`/products/${productId}/questions/${questionId}/answers`, { answer });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upvote a product question
   * @param {String} productId - Product ID
   * @param {String} questionId - Question ID
   * @returns {Promise} - Updated product
   */
  upvoteQuestion: async (productId, questionId) => {
    try {
      const response = await API.post(`/products/${productId}/questions/${questionId}/upvote`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upvote a product answer
   * @param {String} productId - Product ID
   * @param {String} questionId - Question ID
   * @param {String} answerId - Answer ID
   * @returns {Promise} - Updated product
   */
  upvoteAnswer: async (productId, questionId, answerId) => {
    try {
      const response = await API.post(`/products/${productId}/questions/${questionId}/answers/${answerId}/upvote`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
};

export default productService;