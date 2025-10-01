/**
 * Sanitize input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - The sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character'
    };
  }
  
  return {
    isValid: true,
    message: 'Password is strong'
  };
};

/**
 * Validate file type for upload
 * @param {File} file - The file to validate
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {boolean} - Whether the file type is valid
 */
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {boolean} - Whether the file size is valid
 */
export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

export default {
  sanitizeInput,
  validateEmail,
  validatePassword,
  validateFileType,
  validateFileSize
};