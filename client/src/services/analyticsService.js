import API from './api';

const analyticsService = {
  /**
   * Get dashboard metrics
   * @returns {Promise} Dashboard metrics data
   */
  getDashboardMetrics: async () => {
    try {
      const response = await API.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get sales analytics
   * @param {Object} params - Query parameters
   * @returns {Promise} Sales analytics data
   */
  getSalesAnalytics: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams(params);
      const response = await API.get(`/analytics/sales-analytics?${searchParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get product analytics
   * @returns {Promise} Product analytics data
   */
  getProductAnalytics: async () => {
    try {
      const response = await API.get('/analytics/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user analytics
   * @param {Object} params - Query parameters
   * @returns {Promise} User analytics data
   */
  getUserAnalytics: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams(params);
      const response = await API.get(`/analytics/users?${searchParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get order analytics
   * @returns {Promise} Order analytics data
   */
  getOrderAnalytics: async () => {
    try {
      const response = await API.get('/analytics/orders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get revenue breakdown
   * @param {Object} params - Query parameters
   * @returns {Promise} Revenue breakdown data
   */
  getRevenueBreakdown: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams(params);
      const response = await API.get(`/analytics/revenue-breakdown?${searchParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Export data as CSV
   * @param {Object} params - Query parameters
   * @returns {Promise} CSV data
   */
  exportCSV: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams(params);
      const response = await API.get(`/analytics/export/csv?${searchParams.toString()}`, {
        responseType: 'blob'
      });
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${params.type}-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Export report as PDF
   * @param {Object} params - Query parameters
   * @returns {Promise} PDF data
   */
  exportPDF: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams(params);
      const response = await API.get(`/analytics/export/pdf?${searchParams.toString()}`, {
        responseType: 'blob'
      });
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default analyticsService;