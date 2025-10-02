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
    const response = await API.post('/orders/process-payment', paymentData);
    return response.data;
  }
};

export default paymentService;