const NodeCache = require('node-cache');
const logger = require('../utils/logger');

/**
 * Cache Service
 * Provides caching functionality using NodeCache as a fallback
 * Can be extended to use Redis when available
 */

class CacheService {
  constructor() {
    // Initialize NodeCache as fallback
    this.nodeCache = new NodeCache({ stdTTL: 600 }); // 10 minutes default TTL
    
    // Try to initialize Redis if available
    this.redisClient = null;
    this.initRedis();
  }

  /**
   * Initialize Redis client if available
   */
  async initRedis() {
    try {
      // Only try to initialize Redis in production or when explicitly enabled
      if (process.env.REDIS_ENABLED === 'true' || process.env.NODE_ENV === 'production') {
        const redis = await import('redis');
        this.redisClient = redis.createClient({
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD || null
        });

        this.redisClient.on('error', (err) => {
          logger.error('Redis error:', err);
        });

        await this.redisClient.connect();
        logger.info('Redis cache initialized');
      }
    } catch (error) {
      logger.warn('Redis not available, using NodeCache as fallback:', error.message);
    }
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<any>} - Cached value or null
   */
  async get(key) {
    try {
      // Try Redis first if available
      if (this.redisClient) {
        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) : null;
      }
      
      // Fallback to NodeCache
      return this.nodeCache.get(key);
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (optional)
   * @returns {Promise<boolean>} - Success status
   */
  async set(key, value, ttl = 600) {
    try {
      const serializedValue = JSON.stringify(value);
      
      // Try Redis first if available
      if (this.redisClient) {
        await this.redisClient.setEx(key, ttl, serializedValue);
        return true;
      }
      
      // Fallback to NodeCache
      return this.nodeCache.set(key, value, ttl);
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} - Success status
   */
  async del(key) {
    try {
      // Try Redis first if available
      if (this.redisClient) {
        await this.redisClient.del(key);
        return true;
      }
      
      // Fallback to NodeCache
      return this.nodeCache.del(key);
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Check if key exists in cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} - Existence status
   */
  async exists(key) {
    try {
      // Try Redis first if available
      if (this.redisClient) {
        const result = await this.redisClient.exists(key);
        return result > 0;
      }
      
      // Fallback to NodeCache
      return this.nodeCache.has(key);
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * Clear all cache entries
   * @returns {Promise<boolean>} - Success status
   */
  async flush() {
    try {
      // Try Redis first if available
      if (this.redisClient) {
        await this.redisClient.flushAll();
        return true;
      }
      
      // Fallback to NodeCache
      this.nodeCache.flushAll();
      return true;
    } catch (error) {
      logger.error('Cache flush error:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   * @returns {Promise<object>} - Cache statistics
   */
  async stats() {
    try {
      // Try Redis first if available
      if (this.redisClient) {
        const info = await this.redisClient.info();
        return { type: 'redis', info };
      }
      
      // Fallback to NodeCache
      return { type: 'node-cache', stats: this.nodeCache.getStats() };
    } catch (error) {
      logger.error('Cache stats error:', error);
      return { type: 'unknown', error: error.message };
    }
  }
}

// Export singleton instance
module.exports = new CacheService();