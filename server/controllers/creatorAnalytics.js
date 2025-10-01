const ProductConcept = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Review = require('../models/Review');
const Comment = require('../models/Comment');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Get creator analytics dashboard data
// @route   GET /api/creator/analytics
// @access  Private/Creator
exports.getCreatorAnalytics = asyncHandler(async (req, res, next) => {
  // Only creators and admins can access this
  if (req.user.role !== 'Creator' && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to access this route', 403));
  }
  
  // Get creator's products
  const products = await ProductConcept.find({ 
    creator: req.user.id 
  }).select('_id title price fundingGoal currentFunding status averageRating totalReviews views likes createdAt');
  
  // Get date ranges for analytics
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Traffic Analytics: Views over time
  const viewData = await ProductConcept.aggregate([
    { $match: { creator: req.user._id, createdAt: { $gte: oneMonthAgo } } },
    { $group: { 
        _id: { 
          year: { $year: "$createdAt" }, 
          month: { $month: "$createdAt" }, 
          day: { $dayOfMonth: "$createdAt" } 
        }, 
        totalViews: { $sum: "$views" } 
      } 
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
  ]);
  
  // Engagement Metrics: Comments and likes
  const commentCount = await Comment.countDocuments({ 
    product: { $in: products.map(p => p._id) } 
  });
  
  const totalLikes = products.reduce((sum, product) => sum + product.likes, 0);
  
  // Conversion Funnel: Views → Clicks → Backs
  const totalViews = products.reduce((sum, product) => sum + product.views, 0);
  const totalBacks = products.reduce((sum, product) => sum + product.currentFunding, 0);
  
  // Demographics: Backer locations (simplified)
  // In a real implementation, you would get actual location data
  const backerLocations = [
    { country: 'USA', backers: 45 },
    { country: 'UK', backers: 23 },
    { country: 'Canada', backers: 18 },
    { country: 'Germany', backers: 15 },
    { country: 'Australia', backers: 12 }
  ];
  
  // Revenue Forecasting: Projected earnings based on current funding rate
  const totalRevenue = products.reduce((sum, product) => sum + (product.currentFunding * product.price), 0);
  
  // Calculate projected revenue for next 30 days based on current rate
  const daysPassed = products.length > 0 ? 
    Math.max(...products.map(p => {
      const days = (now - p.createdAt) / (1000 * 60 * 60 * 24);
      return isNaN(days) ? 0 : days;
    })) : 0;
  
  const dailyFundingRate = daysPassed > 0 ? totalBacks / daysPassed : 0;
  const projectedBacks = totalBacks + (dailyFundingRate * 30);
  const projectedRevenue = projectedBacks * (products.length > 0 ? 
    products.reduce((sum, p) => sum + p.price, 0) / products.length : 0);
  
  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalProducts: products.length,
        totalViews,
        totalBacks,
        totalRevenue,
        averageRating: products.length > 0 ? 
          products.reduce((sum, p) => sum + p.averageRating, 0) / products.length : 0
      },
      trafficAnalytics: {
        viewsOverTime: viewData,
        totalViews
      },
      engagementMetrics: {
        totalComments: commentCount,
        totalLikes,
        engagementRate: totalViews > 0 ? ((commentCount + totalLikes) / totalViews * 100).toFixed(2) : 0
      },
      conversionFunnel: {
        views: totalViews,
        backs: totalBacks,
        conversionRate: totalViews > 0 ? ((totalBacks / totalViews) * 100).toFixed(2) : 0
      },
      demographics: {
        backerLocations
      },
      revenueForecasting: {
        currentRevenue: totalRevenue,
        projectedRevenue: projectedRevenue,
        projectedBacks: Math.round(projectedBacks)
      },
      topProducts: products
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)
        .map(product => ({
          id: product._id,
          title: product.title,
          views: product.views,
          backs: product.currentFunding,
          revenue: product.currentFunding * product.price
        }))
    }
  });
});

// @desc    Get detailed product analytics
// @route   GET /api/creator/analytics/product/:productId
// @access  Private/Creator
exports.getProductAnalytics = asyncHandler(async (req, res, next) => {
  // Only creators and admins can access this
  if (req.user.role !== 'Creator' && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to access this route', 403));
  }
  
  const product = await ProductConcept.findOne({ 
    _id: req.params.productId, 
    creator: req.user.id 
  });
  
  if (!product) {
    return next(new ErrorResponse('Product not found or not authorized', 404));
  }
  
  // Get related data
  const orders = await Order.find({ product: product._id });
  const reviews = await Review.find({ product: product._id });
  const comments = await Comment.find({ product: product._id });
  
  // Calculate metrics
  const totalRevenue = product.currentFunding * product.price;
  const conversionRate = product.views > 0 ? (product.currentFunding / product.views) * 100 : 0;
  
  res.status(200).json({
    success: true,
    data: {
      product: {
        id: product._id,
        title: product.title,
        status: product.status,
        price: product.price,
        fundingGoal: product.fundingGoal,
        currentFunding: product.currentFunding,
        fundingProgress: product.fundingGoal > 0 ? (product.currentFunding / product.fundingGoal) * 100 : 0
      },
      performance: {
        views: product.views,
        likes: product.likes,
        comments: comments.length,
        reviews: reviews.length,
        averageRating: product.averageRating,
        totalRevenue,
        conversionRate: conversionRate.toFixed(2)
      },
      orders: {
        total: orders.length,
        backers: [...new Set(orders.map(order => order.user.toString()))].length
      },
      timeline: {
        createdAt: product.createdAt,
        deadline: product.deadline
      }
    }
  });
});