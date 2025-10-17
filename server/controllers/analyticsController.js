const AnalyticsService = require('../services/analyticsService');
const { protect, isAdmin } = require('../middleware/auth');

/**
 * Get dashboard metrics
 * @route GET /api/analytics/dashboard
 * @access Private/Admin
 */
const getDashboardMetrics = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const metrics = await AnalyticsService.getDashboardMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get sales analytics
 * @route GET /api/analytics/sales
 * @access Private/Admin
 */
const getSalesAnalytics = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { startDate, endDate } = req.query;
    const analytics = await AnalyticsService.getSalesAnalytics(startDate, endDate);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get product analytics
 * @route GET /api/analytics/products
 * @access Private/Admin
 */
const getProductAnalytics = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const analytics = await AnalyticsService.getProductAnalytics();
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get user analytics
 * @route GET /api/analytics/users
 * @access Private/Admin
 */
const getUserAnalytics = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { startDate, endDate } = req.query;
    const analytics = await AnalyticsService.getUserAnalytics(startDate, endDate);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get order analytics
 * @route GET /api/analytics/orders
 * @access Private/Admin
 */
const getOrderAnalytics = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const analytics = await AnalyticsService.getOrderAnalytics();
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get revenue breakdown
 * @route GET /api/analytics/revenue
 * @access Private/Admin
 */
const getRevenueBreakdown = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { period } = req.query;
    const breakdown = await AnalyticsService.getRevenueBreakdown(period);
    res.status(200).json(breakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Export data as CSV
 * @route GET /api/analytics/export/csv
 * @access Private/Admin
 */
const exportCSV = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { type, startDate, endDate } = req.query;
    
    let data = [];
    let headers = [];
    
    switch (type) {
      case 'sales':
        const salesData = await AnalyticsService.getSalesAnalytics(startDate, endDate);
        data = salesData.dailySales;
        headers = ['_id', 'sales', 'orders'];
        break;
      case 'users':
        const userData = await AnalyticsService.getUserAnalytics(startDate, endDate);
        data = userData.newRegistrations;
        headers = ['_id', 'count'];
        break;
      case 'orders':
        const orderData = await AnalyticsService.getOrderAnalytics();
        data = orderData.ordersByStatus;
        headers = ['_id', 'count'];
        break;
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }
    
    const csv = AnalyticsService.exportToCSV(data, headers);
    
    res.header('Content-Type', 'text/csv');
    res.attachment(`analytics-${type}-${new Date().toISOString().slice(0, 10)}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Export report as PDF
 * @route GET /api/analytics/export/pdf
 * @access Private/Admin
 */
const exportPDF = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // For now, we'll return a placeholder response
    // In a real implementation, this would generate a PDF report
    res.status(200).json({ 
      message: 'PDF export functionality would be implemented here',
      placeholder: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardMetrics,
  getSalesAnalytics,
  getProductAnalytics,
  getUserAnalytics,
  getOrderAnalytics,
  getRevenueBreakdown,
  exportCSV,
  exportPDF
};