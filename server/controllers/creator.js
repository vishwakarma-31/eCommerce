const ProductConcept = require('../models/ProductConcept');
const PreOrder = require('../models/PreOrder');
const Order = require('../models/Order');
const { protect, isCreator } = require('../middleware/auth');

// Get creator dashboard overview
const getDashboard = async (req, res) => {
  try {
    // Get creator's products
    const products = await ProductConcept.find({ creator: req.user._id });
    
    // Calculate dashboard metrics
    const totalProducts = products.length;
    
    // Count products in different statuses
    const fundingProducts = products.filter(p => p.status === 'Funding').length;
    const successfulProducts = products.filter(p => p.status === 'Successful').length;
    const marketplaceProducts = products.filter(p => p.status === 'Marketplace').length;
    
    // Calculate total earnings (simplified)
    const preOrders = await PreOrder.find({ 
      productConcept: { $in: products.map(p => p._id) },
      status: 'Paid'
    });
    
    const orders = await Order.find({
      'items.product': { $in: products.map(p => p._id) },
      paymentStatus: 'Completed'
    });
    
    const totalEarnings = 
      preOrders.reduce((sum, order) => sum + order.totalPrice, 0) +
      orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    res.json({
      totalProducts,
      fundingProducts,
      successfulProducts,
      marketplaceProducts,
      totalEarnings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all creator's projects
const getProjects = async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const products = await ProductConcept.find({ creator: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await ProductConcept.countDocuments({ creator: req.user._id });
    
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

// Get product analytics
const getProductAnalytics = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Check if product belongs to creator
    const product = await ProductConcept.findOne({ 
      _id: productId, 
      creator: req.user._id 
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get pre-orders for this product
    const preOrders = await PreOrder.find({ productConcept: productId });
    
    // Get orders for this product
    const orders = await Order.find({ 'items.product': productId });
    
    // Calculate metrics
    const totalPreOrders = preOrders.length;
    const totalPreOrderRevenue = preOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    const totalOrders = orders.length;
    const totalOrderRevenue = orders.reduce((sum, order) => {
      return sum + order.items
        .filter(item => item.product.toString() === productId)
        .reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
    }, 0);
    
    res.json({
      product,
      totalPreOrders,
      totalPreOrderRevenue,
      totalOrders,
      totalOrderRevenue,
      totalRevenue: totalPreOrderRevenue + totalOrderRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get earnings summary
const getEarnings = async (req, res) => {
  try {
    // Get creator's products
    const products = await ProductConcept.find({ creator: req.user._id });
    
    // Get pre-orders for creator's products
    const preOrders = await PreOrder.find({ 
      productConcept: { $in: products.map(p => p._id) },
      status: 'Paid'
    });
    
    // Get orders for creator's products
    const orders = await Order.find({
      'items.product': { $in: products.map(p => p._id) },
      paymentStatus: 'Completed'
    });
    
    // Calculate earnings by time period
    const earnings = {
      total: 0,
      thisMonth: 0,
      thisYear: 0,
      preOrders: 0,
      marketplace: 0
    };
    
    // Calculate totals
    earnings.preOrders = preOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    earnings.marketplace = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    earnings.total = earnings.preOrders + earnings.marketplace;
    
    // Calculate this month and year earnings (simplified)
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    earnings.thisMonth = 
      preOrders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear;
        })
        .reduce((sum, order) => sum + order.totalPrice, 0) +
      orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear;
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);
    
    earnings.thisYear = 
      preOrders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getFullYear() === thisYear;
        })
        .reduce((sum, order) => sum + order.totalPrice, 0) +
      orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getFullYear() === thisYear;
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);
    
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getProjects,
  getProductAnalytics,
  getEarnings
};