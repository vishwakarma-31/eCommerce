import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Performance Context
 * Manages performance-related state and functions
 */
const PerformanceContext = createContext();

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

export const PerformanceProvider = ({ children }) => {
  const [metrics, setMetrics] = useState({
    apiCalls: 0,
    cacheHits: 0,
    cacheMisses: 0,
    componentRenders: 0,
    imageLoads: 0,
    bytesLoaded: 0
  });

  // Track API calls
  const trackApiCall = useCallback((wasCached = false) => {
    setMetrics(prev => ({
      ...prev,
      apiCalls: prev.apiCalls + 1,
      cacheHits: wasCached ? prev.cacheHits + 1 : prev.cacheHits,
      cacheMisses: wasCached ? prev.cacheMisses : prev.cacheMisses + 1
    }));
  }, []);

  // Track component renders
  const trackComponentRender = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      componentRenders: prev.componentRenders + 1
    }));
  }, []);

  // Track image loads
  const trackImageLoad = useCallback((bytes) => {
    setMetrics(prev => ({
      ...prev,
      imageLoads: prev.imageLoads + 1,
      bytesLoaded: prev.bytesLoaded + bytes
    }));
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    setMetrics({
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      componentRenders: 0,
      imageLoads: 0,
      bytesLoaded: 0
    });
  }, []);

  // Get cache hit ratio
  const getCacheHitRatio = useCallback(() => {
    if (metrics.cacheHits + metrics.cacheMisses === 0) return 0;
    return (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100;
  }, [metrics.cacheHits, metrics.cacheMisses]);

  // Get performance summary
  const getPerformanceSummary = useCallback(() => {
    return {
      ...metrics,
      cacheHitRatio: getCacheHitRatio(),
      averageBytesPerImage: metrics.imageLoads > 0 ? metrics.bytesLoaded / metrics.imageLoads : 0
    };
  }, [metrics, getCacheHitRatio]);

  // Log performance metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Performance Metrics:', getPerformanceSummary());
      }
    }, 30000); // Log every 30 seconds

    return () => clearInterval(interval);
  }, [getPerformanceSummary]);

  const value = {
    metrics,
    trackApiCall,
    trackComponentRender,
    trackImageLoad,
    resetMetrics,
    getCacheHitRatio,
    getPerformanceSummary
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

export default PerformanceContext;