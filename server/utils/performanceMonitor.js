const logger = require('./logger');

/**
 * Performance Monitoring Service
 * Tracks and logs performance metrics for the application
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      databaseQueries: 0,
      averageResponseTime: 0,
      totalResponseTime: 0,
      slowRequests: 0,
      bytesTransferred: 0
    };
    
    this.SLOW_REQUEST_THRESHOLD = 1000; // 1 second
  }

  /**
   * Track API call metrics
   * @param {string} endpoint - The API endpoint
   * @param {number} responseTime - Response time in milliseconds
   * @param {number} statusCode - HTTP status code
   * @param {boolean} wasCached - Whether the response was cached
   * @param {number} bytesTransferred - Bytes transferred
   */
  trackApiCall(endpoint, responseTime, statusCode, wasCached = false, bytesTransferred = 0) {
    this.metrics.apiCalls++;
    this.metrics.totalResponseTime += responseTime;
    this.metrics.averageResponseTime = this.metrics.totalResponseTime / this.metrics.apiCalls;
    this.metrics.bytesTransferred += bytesTransferred;
    
    if (wasCached) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }
    
    if (responseTime > this.SLOW_REQUEST_THRESHOLD) {
      this.metrics.slowRequests++;
      logger.warn(`Slow request detected: ${endpoint} took ${responseTime}ms`, {
        endpoint,
        responseTime,
        statusCode
      });
    }
    
    // Log every 100 API calls
    if (this.metrics.apiCalls % 100 === 0) {
      this.logSummary();
    }
  }

  /**
   * Track database query
   * @param {string} queryType - Type of database query
   * @param {number} executionTime - Execution time in milliseconds
   * @param {number} resultCount - Number of results returned
   */
  trackDatabaseQuery(queryType, executionTime, resultCount) {
    this.metrics.databaseQueries++;
    
    if (executionTime > 500) { // 500ms threshold for slow queries
      logger.warn(`Slow database query detected: ${queryType} took ${executionTime}ms`, {
        queryType,
        executionTime,
        resultCount
      });
    }
  }

  /**
   * Get cache hit ratio
   * @returns {number} Cache hit ratio as percentage
   */
  getCacheHitRatio() {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    if (total === 0) return 0;
    return (this.metrics.cacheHits / total) * 100;
  }

  /**
   * Log performance summary
   */
  logSummary() {
    const summary = {
      ...this.metrics,
      cacheHitRatio: this.getCacheHitRatio(),
      averageResponseTime: Math.round(this.metrics.averageResponseTime * 100) / 100
    };
    
    logger.info('Performance Summary', summary);
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      databaseQueries: 0,
      averageResponseTime: 0,
      totalResponseTime: 0,
      slowRequests: 0,
      bytesTransferred: 0
    };
  }

  /**
   * Get current metrics
   * @returns {Object} Current metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      cacheHitRatio: this.getCacheHitRatio(),
      averageResponseTime: Math.round(this.metrics.averageResponseTime * 100) / 100
    };
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export middleware for tracking API calls
const performanceMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Capture response finish to calculate metrics
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const endpoint = `${req.method} ${req.path}`;
    const statusCode = res.statusCode;
    const contentLength = parseInt(res.get('Content-Length')) || 0;
    
    // Check if response was cached
    const wasCached = res.getHeader('X-Cache') === 'HIT';
    
    performanceMonitor.trackApiCall(endpoint, responseTime, statusCode, wasCached, contentLength);
  });
  
  next();
};

module.exports = {
  performanceMonitor,
  performanceMiddleware
};