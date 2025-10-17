import API from './api';

const recommendationService = {
  /**
   * Get personalized recommendations for the user
   * @param {Number} limit - Maximum number of recommendations to return
   * @returns {Promise} - Recommended products
   */
  getPersonalizedRecommendations: async (limit = 10) => {
    try {
      const response = await API.get(`/recommendations/personalized?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get trending products
   * @param {Number} limit - Maximum number of trending products to return
   * @returns {Promise} - Trending products
   */
  getTrendingProducts: async (limit = 10) => {
    try {
      const response = await API.get(`/recommendations/trending?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get recommendations based on browsing history
   * @param {Number} limit - Maximum number of recommendations to return
   * @returns {Promise} - Recommended products
   */
  getBrowsingHistoryRecommendations: async (limit = 10) => {
    try {
      const response = await API.get(`/recommendations/browsing-history?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get recommendations based on cart items
   * @param {Number} limit - Maximum number of recommendations to return
   * @returns {Promise} - Recommended products
   */
  getCartBasedRecommendations: async (limit = 10) => {
    try {
      const response = await API.get(`/recommendations/cart?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default recommendationService;