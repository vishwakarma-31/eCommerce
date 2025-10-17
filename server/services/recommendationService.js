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
  
  /**
   * Get personalized recommendations based on user's browsing history
   * @param {Array} browsingHistory - Array of product IDs the user has viewed
   * @param {Number} limit - Maximum number of recommendations to return
   * @returns {Array} Array of recommended products
   */
  static async getBrowsingHistoryRecommendations(browsingHistory, limit = 10) {
    try {
      if (!browsingHistory || browsingHistory.length === 0) {
        return [];
      }
      
      // Get products from the browsing history
      const historyProducts = await ProductConcept.find({
        _id: { $in: browsingHistory },
        status: { $in: ['Funding', 'Marketplace'] }
      });
      
      if (historyProducts.length === 0) {
        return [];
      }
      
      // Extract categories and tags from browsing history
      const categories = [...new Set(historyProducts.map(product => product.category))];
      const allTags = historyProducts.flatMap(product => product.tags || []);
      const tags = [...new Set(allTags)];
      
      // Build recommendation query
      const query = {
        _id: { $nin: browsingHistory }, // Exclude products already viewed
        status: { $in: ['Funding', 'Marketplace'] }
      };
      
      // Add category or tag filter if available
      if (categories.length > 0 || tags.length > 0) {
        query.$or = [];
        if (categories.length > 0) {
          query.$or.push({ category: { $in: categories } });
        }
        if (tags.length > 0) {
          query.$or.push({ tags: { $in: tags } });
        }
      }
      
      // Get recommendations
      const recommendations = await ProductConcept.find(query)
        .sort({ popularityScore: -1, averageRating: -1, views: -1 })
        .limit(limit);
      
      return recommendations;
    } catch (error) {
      console.error('Error getting browsing history recommendations:', error);
      return [];
    }
  }
  
  /**
   * Get recommendations based on user's cart items
   * @param {Array} cartItems - Array of product IDs in the user's cart
   * @param {Number} limit - Maximum number of recommendations to return
   * @returns {Array} Array of recommended products
   */
  static async getCartBasedRecommendations(cartItems, limit = 10) {
    try {
      if (!cartItems || cartItems.length === 0) {
        return [];
      }
      
      // Extract product IDs from cart items
      const productIds = cartItems.map(item => item.product);
      
      // Get products from the cart
      const cartProducts = await ProductConcept.find({
        _id: { $in: productIds },
        status: { $in: ['Funding', 'Marketplace'] }
      });
      
      if (cartProducts.length === 0) {
        return [];
      }
      
      // Extract categories and tags from cart products
      const categories = [...new Set(cartProducts.map(product => product.category))];
      const allTags = cartProducts.flatMap(product => product.tags || []);
      const tags = [...new Set(allTags)];
      
      // Build recommendation query
      const query = {
        _id: { $nin: productIds }, // Exclude products already in cart
        status: { $in: ['Funding', 'Marketplace'] }
      };
      
      // Add category or tag filter if available
      if (categories.length > 0 || tags.length > 0) {
        query.$or = [];
        if (categories.length > 0) {
          query.$or.push({ category: { $in: categories } });
        }
        if (tags.length > 0) {
          query.$or.push({ tags: { $in: tags } });
        }
      }
      
      // Get recommendations
      const recommendations = await ProductConcept.find(query)
        .sort({ popularityScore: -1, averageRating: -1, views: -1 })
        .limit(limit);
      
      return recommendations;
    } catch (error) {
      console.error('Error getting cart-based recommendations:', error);
      return [];
    }
  }
  
  /**
   * Get personalized recommendations for a user
   * Combines multiple recommendation strategies
   * @param {Object} user - User object with browsing history, purchase history, etc.
   * @param {Array} cartItems - Array of items in user's cart
   * @param {Number} limit - Maximum number of recommendations to return
   * @returns {Array} Array of recommended products
   */
  static async getPersonalizedRecommendations(user, cartItems = [], limit = 10) {
    try {
      // Get recommendations from different sources
      const [browsingRecs, cartRecs, trendingRecs] = await Promise.all([
        this.getBrowsingHistoryRecommendations(user.browsingHistory || [], Math.ceil(limit / 3)),
        this.getCartBasedRecommendations(cartItems, Math.ceil(limit / 3)),
        this.getTrendingProducts(Math.ceil(limit / 3))
      ]);
      
      // Combine all recommendations
      const allRecommendations = [...browsingRecs, ...cartRecs, ...trendingRecs];
      
      // Remove duplicates by ID
      const uniqueRecommendations = Array.from(
        new Map(allRecommendations.map(product => [product._id.toString(), product])).values()
      );
      
      // Sort by relevance (popularity score, ratings, views)
      uniqueRecommendations.sort((a, b) => {
        // Sort by popularity score first
        if (b.popularityScore !== a.popularityScore) {
          return b.popularityScore - a.popularityScore;
        }
        // Then by average rating
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        // Then by views
        return b.views - a.views;
      });
      
      // Return limited results
      return uniqueRecommendations.slice(0, limit);
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }
}

module.exports = RecommendationEngine;