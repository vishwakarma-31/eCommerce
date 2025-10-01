const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getUsers,
  updateUserStatus,
  deleteUser,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  getOrders,
  getAnalytics,
  generateSalesReport
} = require('../controllers/admin');
const { protect, isAdmin } = require('../middleware/auth');

// Apply protection middleware to all routes
router.use(protect, isAdmin);

// GET /api/admin/dashboard - Get admin dashboard stats
router.get('/dashboard', getDashboard);

// GET /api/admin/users - Get all users with pagination
router.get('/users', getUsers);

// PUT /api/admin/users/:id/status - Activate/deactivate user
router.put('/users/:id/status', updateUserStatus);

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', deleteUser);

// GET /api/admin/products/pending - Get products pending approval
router.get('/products/pending', getPendingProducts);

// PUT /api/admin/products/:id/approve - Approve product
router.put('/products/:id/approve', approveProduct);

// PUT /api/admin/products/:id/reject - Reject product
router.put('/products/:id/reject', rejectProduct);

// GET /api/admin/orders - Get all orders
router.get('/orders', getOrders);

// GET /api/admin/analytics - Get platform analytics
router.get('/analytics', getAnalytics);

// GET /api/admin/reports/sales - Generate sales report
router.get('/reports/sales', generateSalesReport);

module.exports = router;