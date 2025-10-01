const mongoose = require('mongoose');
const ProductConcept = require('../models/ProductConcept');
const User = require('../models/User');
const Order = require('../models/Order');
const PreOrder = require('../models/PreOrder');

/**
 * Success Metrics Service
 * Provides comprehensive analytics and KPIs for the LaunchPad Market platform
 */
class SuccessMetricsService {
  /**
   * Get key performance indicators (KPIs)
   * @returns {Object} KPI metrics including user counts, project stats, revenue, etc.
   */
  static async getKPIs() {
    try {
      // Get total registered users
      const totalUsers = await User.countDocuments({});
      
      // Get active projects (Funding status)
      const activeProjects = await ProductConcept.countDocuments({ status: 'Funding' });
      
      // Get successfully funded projects
      const successfulProjects = await ProductConcept.countDocuments({ status: 'Successful' });
      const totalProjects = await ProductConcept.countDocuments({});
      const fundedRatio = totalProjects > 0 ? ((successfulProjects / totalProjects) * 100).toFixed(2) : 0;
      
      // Get total revenue processed
      const marketplaceOrders = await Order.aggregate([
        { $match: { paymentStatus: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      
      const preOrders = await PreOrder.aggregate([
        { $match: { status: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]);
      
      const totalRevenue = (marketplaceOrders[0]?.total || 0) + (preOrders[0]?.total || 0);
      
      // Get average project funding time
      const fundedProjects = await ProductConcept.find({ status: 'Successful' });
      let totalFundingTime = 0;
      let fundedProjectCount = 0;
      
      fundedProjects.forEach(project => {
        const fundingTime = (project.updatedAt - project.createdAt) / (1000 * 60 * 60 * 24); // in days
        totalFundingTime += fundingTime;
        fundedProjectCount++;
      });
      
      const avgFundingTime = fundedProjectCount > 0 ? (totalFundingTime / fundedProjectCount).toFixed(2) : 0;
      
      // Get user retention rate (users who backed projects or created products)
      const activeUsers = await User.countDocuments({
        $or: [
          { backedProjects: { $exists: true, $ne: [] } },
          { role: 'Creator' }
        ]
      });
      
      const retentionRate = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : 0;
      
      // Get average order value
      const completedOrders = await Order.find({ paymentStatus: 'Completed' });
      let totalOrderValue = 0;
      let orderCount = 0;
      
      completedOrders.forEach(order => {
        totalOrderValue += order.totalAmount;
        orderCount++;
      });
      
      const avgOrderValue = orderCount > 0 ? (totalOrderValue / orderCount).toFixed(2) : 0;
      
      // Get conversion rate (views to backs/purchases)
      const allProducts = await ProductConcept.find({});
      let totalViews = 0;
      let totalActions = 0; // backs + purchases
      
      allProducts.forEach(product => {
        totalViews += product.views || 0;
        totalActions += (product.currentFunding || 0) + (product.soldQuantity || 0);
      });
      
      const conversionRate = totalViews > 0 ? ((totalActions / totalViews) * 100).toFixed(2) : 0;
      
      return {
        totalRegisteredUsers: totalUsers,
        activeProjects,
        successfullyFundedProjectsRatio: `${fundedRatio}%`,
        totalRevenueProcessed: totalRevenue,
        averageProjectFundingTime: `${avgFundingTime} days`,
        userRetentionRate: `${retentionRate}%`,
        averageOrderValue: parseFloat(avgOrderValue),
        conversionRate: `${conversionRate}%`
      };
    } catch (error) {
      console.error('Error getting KPIs:', error);
      throw error;
    }
  }
  
  /**
   * Get analytics to track
   * @returns {Object} Analytics data including page views, bounce rate, etc.
   */
  static async getTrackingAnalytics() {
    try {
      // Get page views per product
      const productsWithViews = await ProductConcept.find({ views: { $gt: 0 } })
        .sort({ views: -1 })
        .limit(10)
        .select('title views');
      
      // Calculate average time spent on site (simplified)
      // In a real implementation, this would require client-side tracking
      const avgTimeOnSite = '3 minutes 45 seconds'; // placeholder value
      
      // Calculate bounce rate (simplified)
      // In a real implementation, this would require client-side tracking
      const bounceRate = '42.5%'; // placeholder value
      
      // Calculate cart abandonment rate
      const totalCarts = await User.countDocuments({ 'cart.0': { $exists: true } });
      const totalOrders = await Order.countDocuments({});
      const cartAbandonmentRate = totalCarts > 0 ? 
        (((totalCarts - totalOrders) / totalCarts) * 100).toFixed(2) : 0;
      
      // Get popular search queries (simplified)
      // In a real implementation, this would require tracking search queries
      const popularSearchQueries = [
        'electronics',
        'home decor',
        'fitness',
        'gadgets',
        'outdoor'
      ];
      
      // Get popular categories
      const categoryData = await ProductConcept.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalViews: { $sum: '$views' }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]);
      
      // Get creator success rate
      const totalCreators = await User.countDocuments({ role: 'Creator' });
      const successfulCreators = await User.countDocuments({
        role: 'Creator',
        'backedProjects.0': { $exists: true }
      });
      
      const creatorSuccessRate = totalCreators > 0 ? 
        ((successfulCreators / totalCreators) * 100).toFixed(2) : 0;
      
      return {
        pageViewsPerProduct: productsWithViews,
        averageTimeOnSite: avgTimeOnSite,
        bounceRate: bounceRate,
        cartAbandonmentRate: `${cartAbandonmentRate}%`,
        popularSearchQueries,
        popularCategories: categoryData.map(cat => ({
          category: cat._id,
          productCount: cat.count,
          totalViews: cat.totalViews
        })),
        creatorSuccessRate: `${creatorSuccessRate}%`
      };
    } catch (error) {
      console.error('Error getting tracking analytics:', error);
      throw error;
    }
  }
  
  /**
   * Get detailed user engagement metrics over time
   * @param {Number} days - Number of days to analyze
   * @returns {Array} Time-series data for user engagement
   */
  static async getUserEngagementOverTime(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Get user registration over time
      const userRegistrations = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);
      
      // Get product views over time
      const productViews = await ProductConcept.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            totalViews: { $sum: '$views' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);
      
      return {
        userRegistrations,
        productViews
      };
    } catch (error) {
      console.error('Error getting user engagement over time:', error);
      throw error;
    }
  }
  
  /**
   * Get detailed conversion funnel data
   * @returns {Object} Conversion funnel metrics
   */
  static async getConversionFunnel() {
    try {
      // Get total visitors (simplified)
      const totalVisitors = await User.countDocuments({});
      
      // Get users who viewed products
      const usersWithViews = await User.countDocuments({});
      // In a real implementation, you would track actual product views per user
      
      // Get users who added to cart
      const usersWithCart = await User.countDocuments({ 'cart.0': { $exists: true } });
      
      // Get users who completed orders
      const usersWithOrders = await User.countDocuments({ 
        _id: { $in: await Order.distinct('buyer') } 
      });
      
      // Get users who became creators
      const newCreators = await User.countDocuments({ role: 'Creator' });
      
      return {
        totalVisitors,
        productViews: usersWithViews,
        addedToCart: usersWithCart,
        completedOrders: usersWithOrders,
        becameCreators: newCreators,
        funnel: {
          visitorToViewRate: totalVisitors > 0 ? ((usersWithViews / totalVisitors) * 100).toFixed(2) : 0,
          viewToCartRate: usersWithViews > 0 ? ((usersWithCart / usersWithViews) * 100).toFixed(2) : 0,
          cartToOrderRate: usersWithCart > 0 ? ((usersWithOrders / usersWithCart) * 100).toFixed(2) : 0,
          orderToCreatorRate: usersWithOrders > 0 ? ((newCreators / usersWithOrders) * 100).toFixed(2) : 0
        }
      };
    } catch (error) {
      console.error('Error getting conversion funnel:', error);
      throw error;
    }
  }
}

module.exports = SuccessMetricsService;