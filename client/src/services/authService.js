import api from './api';
import { handleApiError, retryApiCall } from '../utils/errorHandler';

// Helper function to sanitize input to prevent XSS
const sanitizeInput = (input) => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

const authService = {
  // User registration with input sanitization
  register: async (userData) => {
    // Sanitize user inputs
    const sanitizedData = {
      name: sanitizeInput(userData.name),
      email: sanitizeInput(userData.email),
      password: userData.password // Password should not be sanitized
    };
    
    try {
      const response = await api.post('/auth/register', sanitizedData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to register user. Please try again.');
      throw error;
    }
  },

  // User login with input sanitization
  login: async (credentials) => {
    // Sanitize user inputs
    const sanitizedCredentials = {
      email: sanitizeInput(credentials.email),
      password: credentials.password // Password should not be sanitized
    };
    
    try {
      const response = await api.post('/auth/login', sanitizedCredentials);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to login. Please check your credentials.');
      throw error;
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch user profile.');
      throw error;
    }
  },

  // Update user profile with input sanitization
  updateProfile: async (profileData) => {
    // Sanitize user inputs
    const sanitizedData = {};
    for (const [key, value] of Object.entries(profileData)) {
      if (typeof value === 'string') {
        sanitizedData[key] = sanitizeInput(value);
      } else {
        sanitizedData[key] = value;
      }
    }
    
    try {
      const response = await api.put('/auth/me', sanitizedData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to update profile. Please try again.');
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to change password. Please try again.');
      throw error;
    }
  },

  // Forgot password with input sanitization
  forgotPassword: async (email) => {
    const sanitizedEmail = sanitizeInput(email);
    try {
      const response = await api.post('/auth/forgot-password', { email: sanitizedEmail });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to send password reset email. Please try again.');
      throw error;
    }
  },

  // Reset password
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to reset password. Please try again.');
      throw error;
    }
  }
};

export default authService;