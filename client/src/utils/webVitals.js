/**
 * Web Vitals Monitoring Service
 * Tracks Core Web Vitals metrics for performance monitoring
 */

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

/**
 * Send metric to analytics service
 * @param {Object} metric - Web Vitals metric object
 */
const sendToAnalytics = (metric) => {
  // In a real implementation, you would send this data to your analytics service
  // For now, we'll log it to the console
  console.log('[Web Vitals]', metric);
  
  // Example of how you might send to a backend service:
  /*
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      navigationType: metric.navigationType,
      timestamp: new Date().toISOString()
    }),
  });
  */
};

/**
 * Initialize Web Vitals monitoring
 */
export const initWebVitals = () => {
  // Only run in browser environment
  if (typeof window !== 'undefined') {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  }
};

/**
 * Measure custom performance metrics
 * @param {string} metricName - Name of the metric
 * @param {number} value - Value of the metric
 */
export const measureCustomMetric = (metricName, value) => {
  const metric = {
    name: metricName,
    value: value,
    id: Math.random().toString(36).substr(2, 9),
    navigationType: 'custom'
  };
  
  sendToAnalytics(metric);
};

/**
 * Measure component render time
 * @param {string} componentName - Name of the component
 * @param {Function} componentFunction - Component render function
 */
export const measureComponentRender = async (componentName, componentFunction) => {
  const start = performance.now();
  
  try {
    const result = await componentFunction();
    const end = performance.now();
    const duration = end - start;
    
    measureCustomMetric(`${componentName}_render_time`, duration);
    
    return result;
  } catch (error) {
    const end = performance.now();
    const duration = end - start;
    
    measureCustomMetric(`${componentName}_render_time_error`, duration);
    throw error;
  }
};

/**
 * Measure API call performance
 * @param {string} apiName - Name of the API endpoint
 * @param {Function} apiFunction - API call function
 */
export const measureApiCall = async (apiName, apiFunction) => {
  const start = performance.now();
  
  try {
    const result = await apiFunction();
    const end = performance.now();
    const duration = end - start;
    
    measureCustomMetric(`${apiName}_api_time`, duration);
    
    return result;
  } catch (error) {
    const end = performance.now();
    const duration = end - start;
    
    measureCustomMetric(`${apiName}_api_time_error`, duration);
    throw error;
  }
};

export default {
  initWebVitals,
  measureCustomMetric,
  measureComponentRender,
  measureApiCall
};