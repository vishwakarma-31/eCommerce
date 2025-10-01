/**
 * Simple in-memory cache service for caching static data
 */

class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  }

  /**
   * Get cached data by key
   * @param {string} key - Cache key
   * @returns {any|null} Cached data or null if not found/expired
   */
  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    // Check if cache has expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  /**
   * Set data in cache
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set(key, data, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { data, expiresAt });
  }

  /**
   * Delete cached data by key
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cached data
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
module.exports = new CacheService();