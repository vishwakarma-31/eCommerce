import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for API calls with caching
 * Reduces unnecessary API calls by caching responses
 */
const useApiCache = (apiFunction, key, options = {}) => {
  const { 
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    staleTime = 2 * 60 * 1000, // 2 minutes default
    enabled = true,
    refetchOnWindowFocus = true,
    refetchInterval = 0
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cache storage
  const cache = useCallback(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return {
        get: (key) => {
          try {
            const item = sessionStorage.getItem(key);
            if (!item) return null;
            
            const { data, timestamp } = JSON.parse(item);
            // Check if cache is still valid
            if (Date.now() - timestamp < cacheTime) {
              return data;
            } else {
              sessionStorage.removeItem(key);
              return null;
            }
          } catch (e) {
            return null;
          }
        },
        set: (key, data) => {
          try {
            const item = JSON.stringify({
              data,
              timestamp: Date.now()
            });
            sessionStorage.setItem(key, item);
          } catch (e) {
            console.warn('Failed to cache data:', e);
          }
        },
        clear: (key) => {
          try {
            sessionStorage.removeItem(key);
          } catch (e) {
            console.warn('Failed to clear cache:', e);
          }
        }
      };
    }
    return {
      get: () => null,
      set: () => {},
      clear: () => {}
    };
  }, [cacheTime]);

  // Fetch data function
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheInstance = cache();
      const cachedData = cacheInstance.get(key);
      
      if (cachedData && !forceRefresh) {
        // Check if data is stale
        const { timestamp } = JSON.parse(sessionStorage.getItem(key) || '{}');
        const isStale = Date.now() - timestamp > staleTime;
        
        if (!isStale) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const result = await apiFunction();
      setData(result);
      
      // Cache the result
      cacheInstance.set(key, result);
    } catch (err) {
      setError(err);
      // Clear cache on error
      cache().clear(key);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, key, enabled, cache, staleTime]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData, refetchOnWindowFocus]);

  // Refetch at interval
  useEffect(() => {
    if (refetchInterval <= 0) return;

    const interval = setInterval(() => {
      fetchData();
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [fetchData, refetchInterval]);

  // Invalidate cache
  const invalidateCache = useCallback(() => {
    cache().clear(key);
  }, [cache, key]);

  // Refetch function
  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    invalidateCache
  };
};

export default useApiCache;