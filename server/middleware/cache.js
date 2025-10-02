const NodeCache = require('node-cache');

// Create cache instance with default TTL of 10 minutes
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

/**
 * Cache middleware for GET requests
 * @param {number} duration - Cache duration in seconds (default: 600 seconds/10 minutes)
 */
const cacheMiddleware = (duration = 600) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      // Return cached response
      return res.json(cachedResponse);
    }

    // Override res.json to cache the response
    res.originalJson = res.json;
    res.json = function (body) {
      // Cache the response
      cache.set(key, body, duration);
      // Call the original json method
      res.originalJson(body);
    };

    next();
  };
};

/**
 * Invalidate cache for specific keys
 * @param {string} key - Cache key to invalidate
 */
const invalidateCache = (key) => {
  cache.del(key);
};

/**
 * Invalidate multiple cache keys by pattern
 * @param {string} pattern - Pattern to match cache keys
 */
const invalidateCachePattern = (pattern) => {
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.includes(pattern));
  cache.del(matchingKeys);
};

module.exports = {
  cacheMiddleware,
  invalidateCache,
  invalidateCachePattern
};