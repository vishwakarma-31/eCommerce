import API from './api';

const orderService = {
  // Get all orders for current user
  getMyOrders: async (params = {}) => {
    const response = await API.get('/orders/my-orders', { params });
    return response.data;
  },

  // Get a single order by ID
  getOrderById: async (id) => {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  },

  // Create a new order
  createOrder: async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data;
  },

  // Cancel an order
  cancelOrder: async (id) => {
    const response = await API.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Get orders for admin
  getAllOrders: async (params = {}) => {
    const response = await API.get('/orders', { params });
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (id, status) => {
    const response = await API.put(`/orders/${id}/status`, { status });
    return response.data;
  }
};

export default orderService;