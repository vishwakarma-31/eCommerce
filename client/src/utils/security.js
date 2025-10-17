/**
 * Frontend Security Utilities
 * Provides functions for sanitizing user input and handling security concerns
 */

// Simple XSS sanitization function
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// Sanitize HTML content using DOMPurify if available
export const sanitizeHTML = (html) => {
  // If DOMPurify is available, use it
  if (typeof window !== 'undefined' && window.DOMPurify) {
    return window.DOMPurify.sanitize(html);
  }
  
  // Fallback to basic sanitization
  return sanitizeInput(html);
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  // Password strength requirements:
  // - Minimum 8 characters
  // - At least one uppercase letter
  // - At least one lowercase letter
  // - At least one number
  // - At least one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Securely store data in localStorage
export const secureSetItem = (key, value) => {
  try {
    // Don't store sensitive data like passwords or tokens
    if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token')) {
      console.warn('Security warning: Do not store sensitive data in localStorage');
      return false;
    }
    
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error storing data in localStorage:', error);
    return false;
  }
};

// Securely retrieve data from localStorage
export const secureGetItem = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error retrieving data from localStorage:', error);
    return null;
  }
};

// Remove item from localStorage
export const secureRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data from localStorage:', error);
    return false;
  }
};

// Clear all non-sensitive data from localStorage
export const secureClear = () => {
  try {
    // Get all keys
    const keys = Object.keys(localStorage);
    
    // Remove all items except potentially sensitive ones
    keys.forEach(key => {
      if (!key.toLowerCase().includes('password') && 
          !key.toLowerCase().includes('token') && 
          !key.toLowerCase().includes('secret')) {
        localStorage.removeItem(key);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Generate CSRF token (simplified implementation)
export const generateCSRFToken = () => {
  // In a real implementation, this would be provided by the server
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Validate CSRF token (simplified implementation)
export const validateCSRFToken = (token) => {
  // In a real implementation, this would validate against server-stored token
  return typeof token === 'string' && token.length > 0;
};

export default {
  sanitizeInput,
  sanitizeHTML,
  validateEmail,
  validatePassword,
  secureSetItem,
  secureGetItem,
  secureRemoveItem,
  secureClear,
  generateCSRFToken,
  validateCSRFToken
};