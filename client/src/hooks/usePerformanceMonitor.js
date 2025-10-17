import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for monitoring component performance
 * Tracks render times and provides performance metrics
 */
const usePerformanceMonitor = (componentName) => {
  const [renderCount, setRenderCount] = useState(0);
  const [renderTime, setRenderTime] = useState(0);
  const [mountTime, setMountTime] = useState(0);

  // Track component mount time
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      setMountTime(end - start);
      
      // Log performance metrics
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${componentName}] Mount time: ${end - start}ms`);
        console.log(`[${componentName}] Total renders: ${renderCount}`);
        console.log(`[${componentName}] Average render time: ${renderCount > 0 ? renderTime / renderCount : 0}ms`);
      }
    };
  }, [componentName, renderCount, renderTime]);

  // Track render performance
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const renderDuration = end - start;
      
      setRenderCount(prev => prev + 1);
      setRenderTime(prev => prev + renderDuration);
    };
  });

  // Reset metrics
  const resetMetrics = useCallback(() => {
    setRenderCount(0);
    setRenderTime(0);
    setMountTime(0);
  }, []);

  return {
    renderCount,
    renderTime,
    mountTime,
    averageRenderTime: renderCount > 0 ? renderTime / renderCount : 0,
    resetMetrics
  };
};

export default usePerformanceMonitor;