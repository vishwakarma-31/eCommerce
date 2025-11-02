import API from './api';

const categoryService = {
  /**
   * Get all categories
   * @returns {Promise} - Categories data
   */
  getCategories: async () => {
    try {
      const response = await API.get('/categories');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single category by ID
   * @param {String} id - Category ID
   * @returns {Promise} - Category data
   */
  getCategoryById: async (id) => {
    try {
      const response = await API.get(`/categories/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get subcategories for a category
   * @param {String} categoryId - Category ID
   * @returns {Promise} - Subcategories data
   */
  getSubcategories: async (categoryId) => {
    try {
      const response = await API.get(`/categories/${categoryId}/subcategories`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Promise} - Created category
   */
  createCategory: async (categoryData) => {
    try {
      const response = await API.post('/categories', categoryData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a category
   * @param {String} id - Category ID
   * @param {Object} categoryData - Category data
   * @returns {Promise} - Updated category
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await API.put(`/categories/${id}`, categoryData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a category
   * @param {String} id - Category ID
   * @returns {Promise} - Deletion result
   */
  deleteCategory: async (id) => {
    try {
      const response = await API.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default categoryService;