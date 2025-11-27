const User = require('../models/User');
const ProductConcept = require('../models/ProductConcept');
const Order = require('../models/Order');
const PreOrder = require('../models/PreOrder');
const { protect, isAdmin } = require('../middleware/auth');

// Get admin dashboard stats
const getDashboard = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await ProductConcept.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalPreOrders = await PreOrder.countDocuments();
    
    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('buyer', 'name email');
    
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalPreOrders,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users with pagination
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit);
      
    const total = await User.countDocuments();
    
    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Activate/deactivate user
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products pending approval
const getPendingProducts = async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const products = await ProductConcept.find({ isApproved: false })
      .populate('creator', 'name email')
      .skip(skip)
      .limit(limit);
      
    const total = await ProductConcept.countDocuments({ isApproved: false });
    
    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve product
const approveProduct = async (req, res) => {
  try {
    const product = await ProductConcept.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product approved successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject product
const rejectProduct = async (req, res) => {
  try {
    const product = await ProductConcept.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product rejected successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find()
      .populate('buyer', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Order.countDocuments();
    
    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get platform analytics
const getAnalytics = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await ProductConcept.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalPreOrders = await PreOrder.countDocuments();
    
    // Get sales data (simplified)
    const orders = await Order.find();
    const preOrders = await PreOrder.find({ status: 'Authorized' });
    
    const totalRevenue = 
      orders.reduce((sum, order) => sum + order.totalAmount, 0) +
      preOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalPreOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate sales report
const generateSalesReport = async (req, res) => {
  try {
    // Get date range from query params or use default
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    
    // Get orders in date range
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });
    
    // Get pre-orders in date range
    const preOrders = await PreOrder.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: 'Authorized'
    });
    
    // Calculate report data
    const totalOrders = orders.length;
    const totalPreOrders = preOrders.length;
    
    const orderRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const preOrderRevenue = preOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    const totalRevenue = orderRevenue + preOrderRevenue;
    
    // Group by date for chart data (simplified)
    const dailySales = {};
    
    [...orders, ...preOrders].forEach(item => {
      const date = new Date(item.createdAt).toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = 0;
      }
      
      if (item instanceof Order) {
        dailySales[date] += item.totalAmount;
      } else {
        dailySales[date] += item.totalPrice;
      }
    });
    
    res.json({
      period: { startDate, endDate },
      totalOrders,
      totalPreOrders,
      orderRevenue,
      preOrderRevenue,
      totalRevenue,
      dailySales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};