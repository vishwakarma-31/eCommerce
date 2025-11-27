/**
 * Error Handler Utility
 * Centralized error handling for API calls
 */

/**
 * Handle API errors and show user-friendly messages
 * @param {Object} error - The error object
 * @param {string} defaultMessage - Default message to show if no specific error message is available
 */
export const handleApiError = (error, defaultMessage = 'An error occurred. Please try again.') => {
  console.error('API Error:', error);
  
  // Extract error message
  let message = defaultMessage;
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        message = data?.message || 'Invalid request. Please check your input.';
        break;
      case 401:
        message = data?.message || 'Unauthorized. Please log in.';
        break;
      case 403:
        message = data?.message || 'Access forbidden. You do not have permission to perform this action.';
        break;
      case 404:
        message = data?.message || 'Resource not found.';
        break;
      case 409:
        message = data?.message || 'Conflict. The resource may already exist.';
        break;
      case 422:
        message = data?.message || 'Validation error. Please check your input.';
        break;
      case 500:
        message = data?.message || 'Internal server error. Please try again later.';
        break;
      default:
        message = data?.message || defaultMessage;
    }
  } else if (error.request) {
    // Network error (no response received)
    message = 'Network error. Please check your connection and try again.';
  } else {
    // Other errors
    message = error.message || defaultMessage;
  }
  
  // Show error message to user (in a real app, you would use a toast notification or similar)
  console.error(message);
};

/**
 * Retry API call with exponential backoff
 * @param {Function} apiCall - The API call function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} - Promise that resolves with the API response
 */
export const retryApiCall = async (apiCall, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx) except for 408 (Request Timeout) and 429 (Too Many Requests)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        if (error.response.status !== 408 && error.response.status !== 429) {
          throw error;
        }
      }
      
      // If this was the last attempt, throw the error
      if (i === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, i);
      
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 1000;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
  
  throw lastError;
};

export default {
  handleApiError,
  retryApiCall
};