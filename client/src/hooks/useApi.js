/**
 * Custom hook for making API calls with loading and error states
 * This hook handles common API patterns and provides consistent state management
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for API calls
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Object} - Object containing data, loading, error states and refetch function
 */
const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch data from API
   */
  const fetchData = useCallback(async (overrideUrl, overrideOptions = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use override URL if provided, otherwise use the default URL
      const requestUrl = overrideUrl || url;
      const requestOptions = { ...options, ...overrideOptions };
      
      if (!requestUrl) {
        throw new Error('URL is required');
      }
      
      const response = await api.get(requestUrl, requestOptions);
      
      // Check if response is successful
      if (!response.status.toString().startsWith('2')) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setData(response.data);
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        setError({
          message: err.response.data.message || 'An error occurred',
          status: err.response.status
        });
      } else if (err.request) {
        // Request was made but no response received
        setError({
          message: 'Network error. Please check your connection.',
          status: null
        });
      } else {
        // Something else happened
        setError({
          message: err.message || 'An unexpected error occurred',
          status: null
        });
      }
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  /**
   * Refetch data
   */
  const refetch = useCallback((overrideUrl, overrideOptions) => {
    fetchData(overrideUrl, overrideOptions);
  }, [fetchData]);

  // Fetch data on mount if URL is provided
  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, fetchData]);

  return { data, loading, error, refetch };
};

/**
 * Custom hook for POST requests
 * @param {string} url - The API endpoint URL
 * @returns {Object} - Object containing post function, loading, error states
 */
const usePostApi = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Post data to API
   */
  const postData = useCallback(async (postData, config = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!url) {
        throw new Error('URL is required');
      }
      
      const response = await api.post(url, postData, config);
      
      // Check if response is successful
      if (!response.status.toString().startsWith('2')) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setData(response.data);
      return response.data;
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        setError({
          message: err.response.data.message || 'An error occurred',
          status: err.response.status
        });
      } else if (err.request) {
        // Request was made but no response received
        setError({
          message: 'Network error. Please check your connection.',
          status: null
        });
      } else {
        // Something else happened
        setError({
          message: err.message || 'An unexpected error occurred',
          status: null
        });
      }
      
      throw err; // Re-throw error for caller to handle
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { postData, loading, error, data };
};

/**
 * Custom hook for PUT requests
 * @param {string} url - The API endpoint URL
 * @returns {Object} - Object containing put function, loading, error states
 */
const usePutApi = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Put data to API
   */
  const putData = useCallback(async (putData, config = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!url) {
        throw new Error('URL is required');
      }
      
      const response = await api.put(url, putData, config);
      
      // Check if response is successful
      if (!response.status.toString().startsWith('2')) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setData(response.data);
      return response.data;
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        setError({
          message: err.response.data.message || 'An error occurred',
          status: err.response.status
        });
      } else if (err.request) {
        // Request was made but no response received
        setError({
          message: 'Network error. Please check your connection.',
          status: null
        });
      } else {
        // Something else happened
        setError({
          message: err.message || 'An unexpected error occurred',
          status: null
        });
      }
      
      throw err; // Re-throw error for caller to handle
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { putData, loading, error, data };
};

/**
 * Custom hook for DELETE requests
 * @param {string} url - The API endpoint URL
 * @returns {Object} - Object containing delete function, loading, error states
 */
const useDeleteApi = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Delete data from API
   */
  const deleteData = useCallback(async (config = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!url) {
        throw new Error('URL is required');
      }
      
      const response = await api.delete(url, config);
      
      // Check if response is successful
      if (!response.status.toString().startsWith('2')) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setData(response.data);
      return response.data;
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        setError({
          message: err.response.data.message || 'An error occurred',
          status: err.response.status
        });
      } else if (err.request) {
        // Request was made but no response received
        setError({
          message: 'Network error. Please check your connection.',
          status: null
        });
      } else {
        // Something else happened
        setError({
          message: err.message || 'An unexpected error occurred',
          status: null
        });
      }
      
      throw err; // Re-throw error for caller to handle
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { deleteData, loading, error, data };
};

export { useApi, usePostApi, usePutApi, useDeleteApi };
export default useApi;