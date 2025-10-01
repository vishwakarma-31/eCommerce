const mongoose = require('mongoose');
const ProductConcept = require('../models/ProductConcept');

/**
 * Analytics service for aggregating marketplace data
 * Provides insights into sales, revenue, user engagement and product performance
 */
class AnalyticsService {
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