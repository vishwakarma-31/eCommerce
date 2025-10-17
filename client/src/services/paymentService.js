import API from './api';

const paymentService = {
  // Create a payment intent for pre-order
  createPreOrderPaymentIntent: async (preOrderData) => {
    const response = await API.post('/preorders/create-payment-intent', preOrderData);
    return response.data;
  },

  // Create a pre-order
  createPreOrder: async (preOrderData) => {
    const response = await API.post('/preorders', preOrderData);
    return response.data;
  },

  // Get user's pre-orders
  getMyPreOrders: async () => {
    const response = await API.get('/preorders/my-preorders');
    return response.data;
  },

  // Cancel a pre-order
  cancelPreOrder: async (id) => {
    const response = await API.put(`/preorders/${id}/cancel`);
    return response.data;
  },

  // Process marketplace payment
  processMarketplacePayment: async (paymentData) => {
    const response = await API.post('/orders/create-payment', paymentData);
    return response.data;
  },

  // Create an order
  createOrder: async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data;
  },

  // Get user's orders
  getMyOrders: async (params = {}) => {
    const response = await API.get('/orders/my-orders', { params });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await API.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Track order
  trackOrder: async (id) => {
    const response = await API.get(`/orders/${id}/track`);
    return response.data;
  },

  // Download invoice
  downloadInvoice: async (id) => {
    const response = await API.get(`/orders/${id}/invoice`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Request return
  requestReturn: async (id, reason) => {
    const response = await API.post(`/orders/${id}/return`, { reason });
    return response.data;
  }
};

export default paymentService;