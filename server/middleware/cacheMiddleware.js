const cacheService = require('../services/cacheService');
const logger = require('../utils/logger');

/**
 * Cache Middleware
 * Caches API responses based on URL and query parameters
 */

/**
 * Generate cache key from request
 * @param {Object} req - Express request object
 * @returns {string} - Cache key
 */
const generateCacheKey = (req) => {
  const url = req.originalUrl || req.url;
  const query = JSON.stringify(req.query);
  return `cache:${url}:${query}`;
};

/**
 * Cache middleware for GET requests
 * @param {number} ttl - Time to live in seconds
 * @returns {Function} - Express middleware function
 */
const cacheMiddleware = (ttl = 600) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      const key = generateCacheKey(req);
      
      // Try to get cached response
      const cachedResponse = await cacheService.get(key);
      
      if (cachedResponse) {
        logger.info(`Cache hit for ${key}`);
        return res.status(200).json({
          ...cachedResponse,
          cached: true,
          cacheKey: key
        });
      }
      
      logger.info(`Cache miss for ${key}`);
      
      // Override res.send to cache the response
      const originalSend = res.send;
      res.send = function(data) {
        // Cache the response
        cacheService.set(key, JSON.parse(data), ttl).catch(err => {
          logger.error('Error caching response:', err);
        });
        
        // Call original send method
        return originalSend.call(this, data);
      };
      
      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Invalidate cache for a specific key or pattern
 * @param {string} pattern - Cache key pattern to invalidate
 * @returns {Promise<void>}
 */
const invalidateCache = async (pattern) => {
  try {
    // For NodeCache, we would need to implement pattern matching
    // For Redis, we could use KEYS or SCAN commands
    // For now, we'll log the invalidation
    logger.info(`Cache invalidation requested for pattern: ${pattern}`);
  } catch (error) {
    logger.error('Cache invalidation error:', error);
  }
};

/**
 * Invalidate product-related cache
 * @returns {Promise<void>}
 */
const invalidateProductCache = async () => {
  try {
    // Invalidate all product-related cache entries
    await invalidateCache('cache:/api/products*');
    logger.info('Product cache invalidated');
  } catch (error) {
    logger.error('Product cache invalidation error:', error);
  }
};

/**
 * Invalidate user-related cache
 * @returns {Promise<void>}
 */
const invalidateUserCache = async () => {
  try {
    // Invalidate all user-related cache entries
    await invalidateCache('cache:/api/users*');
    logger.info('User cache invalidated');
  } catch (error) {
    logger.error('User cache invalidation error:', error);
  }
};

module.exports = {
  cacheMiddleware,
  invalidateCache,
  invalidateProductCache,
  invalidateUserCache
};