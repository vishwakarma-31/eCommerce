const ProductConcept = require('../models/ProductConcept');
const mongoose = require('mongoose');

/**
 * Simple recommendation engine based on user behavior and product popularity
 * Provides personalized product recommendations, trending products, and category-based suggestions
 */
class RecommendationEngine {
  /**
   * Get recommendations for a user based on their backed/purchased products
   * Analyzes user's purchase history and recommends similar products
   * @param {Object} user - The user object
   * @param {Number} limit - Maximum number of recommendations to return
   * @returns {Array} Array of recommended products
   */
  static async getUserRecommendations(user, limit = 10) {
    try {
      // Get products the user has backed or purchased
      const userProducts = []; // In a real implementation, you would fetch these from the database
      
      // Extract categories from user's products
      const categories = [...new Set(userProducts.map(product => product.category))];
      
      // Find similar products in the same categories
      let recommendations = [];
      
      if (categories.length > 0) {
        recommendations = await ProductConcept.find({
          category: { $in: categories },
          status: { $in: ['Funding', 'Marketplace'] },
          _id: { $nin: userProducts.map(p => p._id) } // Exclude already backed/purchased products
        })
        .sort({ averageRating: -1, views: -1 }) // Sort by rating and popularity
        .limit(limit);
      } else {
        // If no categories found, recommend popular products
        recommendations = await ProductConcept.find({
          status: { $in: ['Funding', 'Marketplace'] }
        })
        .sort({ averageRating: -1, views: -1 })
        .limit(limit);
      }
      
      return recommendations;
    } catch (error) {
      console.error('Error getting user recommendations:', error);
      return [];
    }
  }
  
  /**
   * Get trending products based on recent activity
   * Returns products with high view counts and ratings from the last 30 days
   * @param {Number} limit - Maximum number of trending products to return
   * @returns {Array} Array of trending products
   */
  static async getTrendingProducts(limit = 10) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // In a real implementation, you would use analytics data
      // For now, we'll sort by recent views and ratings
      const trending = await ProductConcept.find({
        createdAt: { $gte: thirtyDaysAgo },
        status: { $in: ['Funding', 'Marketplace'] }
      })
      .sort({ views: -1, averageRating: -1 })
      .limit(limit);
      
      return trending;
    } catch (error) {
      console.error('Error getting trending products:', error);
      return [];
    }
  }
  
  /**
   * Get popular products in similar categories
   * Returns products with high sales volume in a specific category
   * @param {String} category - The category to find popular products
   * @param {Number} limit - Maximum number of products to return
   * @returns {Array} Array of popular products
   */
  static async getPopularInCategory(category, limit = 10) {
    try {
      const popular = await ProductConcept.find({
        category: category,
        status: { $in: ['Funding', 'Marketplace'] }
      })
      .sort({ soldQuantity: -1, views: -1 })
      .limit(limit);
      
      return popular;
    } catch (error) {
      console.error('Error getting popular products in category:', error);
      return [];
    }
  }
}

module.exports = RecommendationEngine;