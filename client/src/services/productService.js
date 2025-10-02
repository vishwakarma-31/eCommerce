import API from './api';

export const productService = {
  getAllProducts: (params) => API.get('/products', { params }),
  getProductById: (id) => API.get(`/products/${id}`),
  createProduct: (data) => API.post('/products', data),
  updateProduct: (id, data) => API.put(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`),
  uploadImages: (id, formData) => API.post(`/products/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  searchProducts: (query) => API.get('/products/search', { params: { q: query } }),
  likeProduct: (id) => API.post(`/products/${id}/like`)
};