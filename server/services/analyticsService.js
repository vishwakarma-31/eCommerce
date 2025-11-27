const mongoose = require('mongoose');
const ProductConcept = require('../models/ProductConcept');
const User = require('../models/User');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

/**
 * Analytics service for aggregating marketplace data
 * Provides insights into sales, revenue, user engagement and product performance
 */
class AnalyticsService {
  /**
   * Get dashboard metrics
   * @returns {Object} Dashboard metrics including revenue, orders, users, products, etc.
   */
  static async getDashboardMetrics() {
    try {
      // Get total revenue
      const totalRevenueResult = await Order.aggregate([
        {
          $match: {
            paymentStatus: 'Completed'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' }
          }
        }
      ]);
      
      const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;
      
      // Get revenue for different time periods
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const dailyRevenueResult = await Order.aggregate([
        {
          $match: {
            paymentStatus: 'Completed',
            createdAt: { $gte: startOfDay }
          }
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$totalAmount' }
          }
        }
      ]);
      
      const weeklyRevenueResult = await Order.aggregate([
        {
          $match: {
            paymentStatus: 'Completed',
            createdAt: { $gte: startOfWeek }
          }
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$totalAmount' }
          }
        }
      ]);
      
      const monthlyRevenueResult = await Order.aggregate([
        {
          $match: {
            paymentStatus: 'Completed',
            createdAt: { $gte: startOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$totalAmount' }
          }
        }
      ]);
      
      const dailyRevenue = dailyRevenueResult.length > 0 ? dailyRevenueResult[0].revenue : 0;
      const weeklyRevenue = weeklyRevenueResult.length > 0 ? weeklyRevenueResult[0].revenue : 0;
      const monthlyRevenue = monthlyRevenueResult.length > 0 ? monthlyRevenueResult[0].revenue : 0;
      
      // Get total orders count with status breakdown
      const orderStatusBreakdown = await Order.aggregate([
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 }
          }
        }
      ]);
      
      const totalOrders = orderStatusBreakdown.reduce((sum, status) => sum + status.count, 0);
      
      // Get total users (active, inactive)
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });
      const inactiveUsers = totalUsers - activeUsers;
      
      // Get total products (active, draft, out of stock)
      const activeProducts = await ProductConcept.countDocuments({ 
        status: { $in: ['Marketplace', 'Active'] } 
      });
      const draftProducts = await ProductConcept.countDocuments({ status: 'Draft' });
      const outOfStockProducts = await ProductConcept.countDocuments({ 
        stockStatus: 'Out of Stock' 
      });
      
      // Calculate average order value
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Calculate conversion rate (orders / users)
      const conversionRate = totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;
      
      // Calculate cart abandonment rate
      const totalCarts = await Cart.countDocuments();
      const cartsWithItems = await Cart.countDocuments({ totalItems: { $gt: 0 } });
      const cartAbandonmentRate = cartsWithItems > 0 ? 
        ((cartsWithItems - totalOrders) / cartsWithItems) * 100 : 0;
      
      // Get top selling products (by revenue)
      const topSellingProducts = await ProductConcept.aggregate([
        {
          $match: {
            soldQuantity: { $gt: 0 }
          }
        },
        {
          $project: {
            title: 1,
            soldQuantity: 1,
            revenue: { $multiply: ['$soldQuantity', '$price'] }
          }
        },
        {
          $sort: { revenue: -1 }
        },
        {
          $limit: 5
        }
      ]);
      
      // Get revenue by category
      const revenueByCategory = await ProductConcept.aggregate([
        {
          $match: {
            soldQuantity: { $gt: 0 }
          }
        },
        {
          $group: {
            _id: '$category',
            revenue: { $sum: { $multiply: ['$soldQuantity', '$price'] } }
          }
        },
        {
          $sort: { revenue: -1 }
        }
      ]);
      
      // Get new vs returning customers
      const newCustomers = await User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });
      
      const returningCustomers = totalUsers - newCustomers;
      
      return {
        totalRevenue,
        dailyRevenue,
        weeklyRevenue,
        monthlyRevenue,
        totalOrders,
        orderStatusBreakdown,
        totalUsers,
        activeUsers,
        inactiveUsers,
        activeProducts,
        draftProducts,
        outOfStockProducts,
        avgOrderValue,
        conversionRate,
        cartAbandonmentRate,
        topSellingProducts,
        revenueByCategory,
        newCustomers,
        returningCustomers
      };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      throw error;
    }
  }
  
  /**
   * Get sales analytics
   * @param {String} startDate - Start date for analytics
   * @param {String} endDate - End date for analytics
   * @returns {Object} Sales analytics data
   */
  static async getSalesAnalytics(startDate, endDate) {
    try {
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Daily sales chart (last 30 days)
      const dailySales = await Order.aggregate([
        {
          $match: {
            paymentStatus: 'Completed',
            createdAt: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            sales: { $sum: '$totalAmount' },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
      
      // Sales by category (pie chart)
      const salesByCategory = await ProductConcept.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'items.product',
            as: 'orders'
          }
        },
        {
          $unwind: '$orders'
        },
        {
          $match: {
            'orders.paymentStatus': 'Completed',
            'orders.createdAt': { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: '$category',
            sales: { $sum: { $multiply: ['$price', '$orders.items.quantity'] } }
          }
        }
      ]);
      
      // Sales by hour of day
      const salesByHour = await Order.aggregate([
        {
          $match: {
            paymentStatus: 'Completed',
            createdAt: { $gte: start, $lte: end }
          }
        },
        {
          $project: {
            hour: { $hour: '$createdAt' },
            totalAmount: 1
          }
        },
        {
          $group: {
            _id: '$hour',
            sales: { $sum: '$totalAmount' },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
      
      // Sales by day of week
      const salesByDayOfWeek = await Order.aggregate([
        {
          $match: {
            paymentStatus: 'Completed',
            createdAt: { $gte: start, $lte: end }
          }
        },
        {
          $project: {
            dayOfWeek: { $dayOfWeek: '$createdAt' },
            totalAmount: 1
          }
        },
        {
          $group: {
            _id: '$dayOfWeek',
            sales: { $sum: '$totalAmount' },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
      
      return {
        dailySales,
        salesByCategory,
        salesByHour,
        salesByDayOfWeek
      };
    } catch (error) {
      console.error('Error getting sales analytics:', error);
      throw error;
    }
  }
  
  /**
   * Get product analytics
   * @returns {Object} Product analytics data
   */
  static async getProductAnalytics() {
    try {
      // Most viewed products
      const mostViewedProducts = await ProductConcept.aggregate([
        {
          $sort: { views: -1 }
        },
        {
          $limit: 10
        },
        {
          $project: {
            title: 1,
            views: 1
          }
        }
      ]);
      
      // Products with most reviews
      const mostReviewedProducts = await ProductConcept.aggregate([
        {
          $sort: { totalReviews: -1 }
        },
        {
          $limit: 10
        },
        {
          $project: {
            title: 1,
            totalReviews: 1
          }
        }
      ]);
      
      // Low stock alerts
      const lowStockProducts = await ProductConcept.find({
        stockStatus: 'Low Stock'
      }).select('title stockQuantity');
      
      // Out of stock products
      const outOfStockProducts = await ProductConcept.find({
        stockStatus: 'Out of Stock'
      }).select('title');
      
      // Products with highest ratings
      const highestRatedProducts = await ProductConcept.aggregate([
        {
          $match: {
            averageRating: { $gt: 0 }
          }
        },
        {
          $sort: { averageRating: -1 }
        },
        {
          $limit: 10
        },
        {
          $project: {
            title: 1,
            averageRating: 1
          }
        }
      ]);
      
      // Products with no sales
      const productsWithNoSales = await ProductConcept.find({
        soldQuantity: 0
      }).select('title createdAt');
      
      return {
        mostViewedProducts,
        mostReviewedProducts,
        lowStockProducts,
        outOfStockProducts,
        highestRatedProducts,
        productsWithNoSales
      };
    } catch (error) {
      console.error('Error getting product analytics:', error);
      throw error;
    }
  }
  
  /**
   * Get user analytics
   * @param {String} startDate - Start date for analytics
   * @param {String} endDate - End date for analytics
   * @returns {Object} User analytics data
   */
  static async getUserAnalytics(startDate, endDate) {
    try {
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      // New registrations over time
      const newRegistrations = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
      
      // Users by role
      const usersByRole = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Most active users (by orders)
      const mostActiveUsers = await Order.aggregate([
        {
          $group: {
            _id: '$buyer',
            orderCount: { $sum: 1 },
            totalSpent: { $sum: '$totalAmount' }
          }
        },
        {
          $sort: { orderCount: -1 }
        },
        {
          $limit: 10
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            name: '$user.name',
            email: '$user.email',
            orderCount: 1,
            totalSpent: 1
          }
        }
      ]);
      
      return {
        newRegistrations,
        usersByRole,
        mostActiveUsers
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    }
  }
  
  /**
   * Get order analytics
   * @returns {Object} Order analytics data
   */
  static async getOrderAnalytics() {
    try {
      // Orders by status
      const ordersByStatus = await Order.aggregate([
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Average delivery time calculation
      const avgDeliveryTimeResult = await Order.aggregate([
        {
          $match: {
            orderStatus: 'Delivered',
            deliveredAt: { $exists: true },
            createdAt: { $exists: true }
          }
        },
        {
          $project: {
            deliveryTime: {
              $divide: [
                { $subtract: ['$deliveredAt', '$createdAt'] },
                1000 * 60 * 60 * 24 // Convert to days
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgDeliveryTime: { $avg: '$deliveryTime' }
          }
        }
      ]);
      
      const avgDeliveryTime = avgDeliveryTimeResult.length > 0 ? 
        avgDeliveryTimeResult[0].avgDeliveryTime : 0;
      
      // Cancelled orders analysis
      const cancelledOrders = await Order.find({ orderStatus: 'Cancelled' })
        .select('totalAmount createdAt');
      
      return {
        ordersByStatus,
        avgDeliveryTime,
        cancelledOrders
      };
    } catch (error) {
      console.error('Error getting order analytics:', error);
      throw error;
    }
  }
  
  /**
   * Get revenue breakdown
   * @param {String} period - Period for revenue breakdown (daily, weekly, monthly)
   * @returns {Array} Revenue breakdown data
   */
  static async getRevenueBreakdown(period = 'monthly') {
    try {
      let groupBy;
      
      switch (period) {
        case 'daily':
          groupBy = {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          };
          break;
        case 'weekly':
          groupBy = {
            $dateToString: { format: '%Y-%U', date: '$createdAt' }
          };
          break;
        case 'monthly':
        default:
          groupBy = {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          };
      }
      
      const revenueBreakdown = await Order.aggregate([
        {
          $group: {
            _id: groupBy,
            revenue: { $sum: '$totalAmount' },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
      
      return revenueBreakdown;
    } catch (error) {
      console.error('Error getting revenue breakdown:', error);
      throw error;
    }
  }
  
  /**
   * Export data as CSV
   * @param {Array} data - Data to export
   * @param {Array} headers - Headers for CSV
   * @returns {String} CSV formatted string
   */
  static exportToCSV(data, headers) {
    try {
      // Create header row
      const headerRow = headers.join(',');
      
      // Create data rows
      const dataRows = data.map(item => {
        return headers.map(header => {
          const value = item[header];
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',');
      });
      
      // Combine header and data rows
      return [headerRow, ...dataRows].join('\n');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }
  
  /**
   * Get total sales per product
   * Aggregates sales data to show top performing products by quantity sold and revenue
   * @returns {Array} Aggregated sales data with product titles, quantities and revenue
   */
  static async getTotalSalesPerProduct() {
    try {
      const salesData = await ProductConcept.aggregate([
        {
          // Use $match to filter early and utilize indexes
          $match: {
            status: { $in: ['Marketplace', 'Successful'] },
            soldQuantity: { $gt: 0 }
          }
        },
        {
          $group: {
            _id: '$_id',
            title: { $first: '$title' },
            totalSales: { $sum: '$soldQuantity' },
            totalRevenue: { $sum: { $multiply: ['$soldQuantity', '$price'] } }
          }
        },
        {
          $sort: { totalSales: -1 }
        },
        {
          // Limit results for better performance
          $limit: 100
        }
      ]).allowDiskUse(true); // Allow disk usage for large datasets
      
      return salesData;
    } catch (error) {
      console.error('Error getting total sales per product:', error);
      return [];
    }
  }
  
  /**
   * Get revenue trends over time
   * Analyzes revenue data over a specified period to identify trends
   * @param {Number} months - Number of months to analyze
   * @returns {Array} Revenue trend data grouped by month
   */
  static async getRevenueTrends(months = 6) {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      
      const trendData = await ProductConcept.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $in: ['Marketplace', 'Successful'] },
            soldQuantity: { $gt: 0 }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            totalRevenue: { $sum: { $multiply: ['$soldQuantity', '$price'] } },
            productCount: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]).allowDiskUse(true);
      
      return trendData;
    } catch (error) {
      console.error('Error getting revenue trends:', error);
      return [];
    }
  }
  
  /**
   * Get user engagement metrics
   * Calculates key engagement indicators including views, likes, ratings and engagement rate
   * @returns {Object} Engagement metrics including total views, likes, average rating and engagement rate
   */
  static async getUserEngagementMetrics() {
    try {
      const metrics = await ProductConcept.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$views' },
            totalLikes: { $sum: '$likes' },
            avgRating: { $avg: '$averageRating' },
            totalProducts: { $sum: 1 }
          }
        },
        {
          // Add computed fields for better insights
          $project: {
            _id: 0,
            totalViews: 1,
            totalLikes: 1,
            avgRating: { $round: ['$avgRating', 2] },
            totalProducts: 1,
            engagementRate: {
              $cond: [
                { $eq: ['$totalViews', 0] },
                0,
                { $round: [{ $multiply: [{ $divide: ['$totalLikes', '$totalViews'] }, 100] }, 2] }
              ]
            }
          }
        }
      ]).allowDiskUse(true);
      
      return metrics.length > 0 ? metrics[0] : {};
    } catch (error) {
      console.error('Error getting user engagement metrics:', error);
      return {};
    }
  }
  
  /**
   * Get conversion rates (views to purchases)
   * Calculates conversion rates for products by comparing views to actual purchases
   * @returns {Array} Conversion rate data with product titles and conversion percentages
   */
  static async getConversionRates() {
    try {
      const conversionData = await ProductConcept.aggregate([
        {
          // Filter early to reduce dataset size
          $match: {
            views: { $gt: 0 },
            status: { $in: ['Marketplace', 'Successful'] }
          }
        },
        {
          $project: {
            title: 1,
            views: 1,
            soldQuantity: 1,
            conversionRate: {
              $cond: [
                { $eq: ['$views', 0] },
                0,
                { $round: [{ $multiply: [{ $divide: ['$soldQuantity', '$views'] }, 100] }, 2] }
              ]
            }
          }
        },
        {
          $sort: { conversionRate: -1 }
        },
        {
          // Limit results for better performance
          $limit: 50
        }
      ]).allowDiskUse(true);
      
      return conversionData;
    } catch (error) {
      console.error('Error getting conversion rates:', error);
      return [];
    }
  }
  
  /**
   * Get top performing categories
   * Analyzes category performance by revenue, product count and average ratings
   * @returns {Array} Category performance data including revenue, product count and average ratings
   */
  static async getTopCategories() {
    try {
      const categoryData = await ProductConcept.aggregate([
        {
          $match: {
            status: { $in: ['Marketplace', 'Successful'] },
            soldQuantity: { $gt: 0 }
          }
        },
        {
          $group: {
            _id: '$category',
            totalProducts: { $sum: 1 },
            totalRevenue: { $sum: { $multiply: ['$soldQuantity', '$price'] } },
            avgRating: { $avg: '$averageRating' },
            totalViews: { $sum: '$views' }
          }
        },
        {
          $project: {
            category: '$_id',
            _id: 0,
            totalProducts: 1,
            totalRevenue: 1,
            avgRating: { $round: ['$avgRating', 2] },
            totalViews: 1,
            revenuePerProduct: { $round: [{ $divide: ['$totalRevenue', '$totalProducts'] }, 2] }
          }
        },
        {
          $sort: { totalRevenue: -1 }
        },
        {
          $limit: 20
        }
      ]).allowDiskUse(true);
      
      return categoryData;
    } catch (error) {
      console.error('Error getting top categories:', error);
      return [];
    }
  }
}

module.exports = AnalyticsService;