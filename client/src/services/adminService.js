import API from './apiService';

const adminService = {
  // User Management
  getUsers: async (params = {}) => {
    const response = await API.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await API.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (id, isActive) => {
    const response = await API.put(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await API.delete(`/admin/users/${id}`);
    return response.data;
  },

  getUserOrders: async (userId, params = {}) => {
    const response = await API.get(`/admin/users/${userId}/orders`, { params });
    return response.data;
  },

  sendEmailToUser: async (userId, emailData) => {
    const response = await API.post(`/admin/users/${userId}/email`, emailData);
    return response.data;
  },

  // Product Management
  getProducts: async (params = {}) => {
    const response = await API.get('/admin/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await API.get(`/admin/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await API.post('/admin/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await API.put(`/admin/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await API.delete(`/admin/products/${id}`);
    return response.data;
  },

  approveProduct: async (id) => {
    const response = await API.put(`/admin/products/${id}/approve`);
    return response.data;
  },

  rejectProduct: async (id) => {
    const response = await API.put(`/admin/products/${id}/reject`);
    return response.data;
  },

  bulkUploadProducts: async (formData) => {
    const response = await API.post('/admin/products/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  bulkUpdateProducts: async (updateData) => {
    const response = await API.put('/admin/products/bulk-update', updateData);
    return response.data;
  },

  // Order Management
  getOrders: async (params = {}) => {
    const response = await API.get('/admin/orders', { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await API.get(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, statusData) => {
    const response = await API.put(`/admin/orders/${id}/status`, statusData);
    return response.data;
  },

  assignTrackingNumber: async (id, trackingData) => {
    const response = await API.put(`/admin/orders/${id}/tracking`, trackingData);
    return response.data;
  },

  processRefund: async (id, refundData) => {
    const response = await API.post(`/admin/orders/${id}/refund`, refundData);
    return response.data;
  },

  resolveDispute: async (id, resolutionData) => {
    const response = await API.put(`/admin/orders/${id}/dispute`, resolutionData);
    return response.data;
  },

  // Category Management
  getCategories: async () => {
    const response = await API.get('/admin/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await API.post('/admin/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await API.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await API.delete(`/admin/categories/${id}`);
    return response.data;
  },

  reorderCategories: async (categoryOrder) => {
    const response = await API.put('/admin/categories/reorder', { order: categoryOrder });
    return response.data;
  },

  // Coupon Management
  getCoupons: async (params = {}) => {
    const response = await API.get('/admin/coupons', { params });
    return response.data;
  },

  getCouponById: async (id) => {
    const response = await API.get(`/admin/coupons/${id}`);
    return response.data;
  },

  createCoupon: async (couponData) => {
    const response = await API.post('/admin/coupons', couponData);
    return response.data;
  },

  updateCoupon: async (id, couponData) => {
    const response = await API.put(`/admin/coupons/${id}`, couponData);
    return response.data;
  },

  deleteCoupon: async (id) => {
    const response = await API.delete(`/admin/coupons/${id}`);
    return response.data;
  },

  deactivateCoupon: async (id) => {
    const response = await API.put(`/admin/coupons/${id}/deactivate`);
    return response.data;
  },

  // Reports
  getSalesReport: async (params = {}) => {
    const response = await API.get('/admin/reports/sales', { params });
    return response.data;
  },

  getProductPerformanceReport: async (params = {}) => {
    const response = await API.get('/admin/reports/product-performance', { params });
    return response.data;
  },

  getUserActivityReport: async (params = {}) => {
    const response = await API.get('/admin/reports/user-activity', { params });
    return response.data;
  },

  exportReport: async (reportType, format, params = {}) => {
    const response = await API.get(`/admin/reports/export/${reportType}/${format}`, { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  // Site Settings
  getSiteSettings: async () => {
    const response = await API.get('/admin/settings');
    return response.data;
  },

  updateSiteSettings: async (settingsData) => {
    const response = await API.put('/admin/settings', settingsData);
    return response.data;
  }
};

export default adminService;