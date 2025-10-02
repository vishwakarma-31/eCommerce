/**
 * Frontend error handling utilities
 * Provides consistent error handling across the application
 */

import { toast } from 'react-toastify';

/**
 * Detect network errors
 * @param {Object} error - The error object
 * @returns {boolean} True if the error is a network error
 */
export const isNetworkError = (error) => {
  return !error.response && 
         (error.code === 'NETWORK_ERROR' || 
          error.message === 'Network Error' ||
          error.name === 'NetworkError');
};

/**
 * Handle API errors and display user-friendly messages
 * @param {Object} error - The error object from API calls
 * @param {string} defaultMessage - Default message to show if no specific error message is available
 * @returns {string} The error message that was displayed
 */
export const handleApiError = (error, defaultMessage = 'An error occurred. Please try again.') => {
  let errorMessage = defaultMessage;
  
  // Handle network errors
  if (isNetworkError(error)) {
    errorMessage = 'Network error. Please check your connection and try again.';
    toast.error(errorMessage);
    return errorMessage;
  }
  
  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    errorMessage = 'Request timeout. Please try again.';
    toast.error(errorMessage);
    return errorMessage;
  }
  
  // Handle HTTP errors
  const { status, data } = error.response || {};
  
  switch (status) {
    case 400:
      errorMessage = data?.error || data?.message || 'Bad request. Please check your input.';
      break;
    case 401:
      errorMessage = data?.error || data?.message || 'Unauthorized. Please log in.';
      break;
    case 403:
      errorMessage = data?.error || data?.message || 'Access forbidden.';
      break;
    case 404:
      errorMessage = data?.error || data?.message || 'Resource not found.';
      break;
    case 409:
      errorMessage = data?.error || data?.message || 'Conflict occurred. Please try again.';
      break;
    case 422:
      errorMessage = data?.error || data?.message || 'Validation error. Please check your input.';
      break;
    case 429:
      errorMessage = data?.error || data?.message || 'Too many requests. Please try again later.';
      break;
    case 500:
      errorMessage = data?.error || data?.message || 'Internal server error. Please try again later.';
      break;
    case 502:
    case 503:
    case 504:
      errorMessage = 'Service temporarily unavailable. Please try again later.';
      break;
    default:
      errorMessage = data?.error || data?.message || defaultMessage;
  }
  
  toast.error(errorMessage);
  return errorMessage;
};

/**
 * Handle form validation errors
 * @param {Object} error - The error object from form validation
 * @returns {Object} Object containing field-specific error messages
 */
export const handleValidationError = (error) => {
  const errors = {};
  
  if (error.name === 'ValidationError') {
    error.details.forEach(detail => {
      errors[detail.path] = detail.message;
    });
  }
  
  return errors;
};

/**
 * Show a success message
 * @param {string} message - The success message to display
 */
export const showSuccessMessage = (message) => {
  toast.success(message);
};

/**
 * Show an info message
 * @param {string} message - The info message to display
 */
export const showInfoMessage = (message) => {
  toast.info(message);
};

/**
 * Show a warning message
 * @param {string} message - The warning message to display
 */
export const showWarningMessage = (message) => {
  toast.warn(message);
};

/**
 * Show an error message
 * @param {string} message - The error message to display
 */
export const showErrorMessage = (message) => {
  toast.error(message);
};

/**
 * Retry a failed API call
 * @param {Function} apiCall - The API call function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise} The result of the API call
 */
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx) except for 408 (timeout) and 429 (rate limit)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        if (error.response.status !== 408 && error.response.status !== 429) {
          throw error;
        }
      }
      
      // If this was the last attempt, throw the error
      if (i === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw lastError;
};

export default {
  isNetworkError,
  handleApiError,
  handleValidationError,
  showSuccessMessage,
  showInfoMessage,
  showWarningMessage,
  showErrorMessage,
  retryApiCall
};