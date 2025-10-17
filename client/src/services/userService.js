import API from './apiService';

const userService = {
  // Get recently viewed products
  getRecentlyViewed: async () => {
    try {
      const response = await API.get('/users/recently-viewed');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add product to recently viewed
  addRecentlyViewed: async (productId) => {
    try {
      const response = await API.post(`/users/recently-viewed/${productId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Clear recently viewed history
  clearRecentlyViewed: async () => {
    try {
      const response = await API.delete('/users/recently-viewed');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await API.put('/users/profile/change-password', {
        currentPassword,
        newPassword
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update email preferences
  updateEmailPreferences: async (preferences) => {
    try {
      const response = await API.put('/users/profile/email-preferences', preferences);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete account
  deleteAccount: async (password) => {
    try {
      const response = await API.delete('/users/profile/account', {
        data: { password }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload profile image
  uploadProfileImage: async (formData) => {
    try {
      const response = await API.post('/users/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Share wishlist
  shareWishlist: async () => {
    try {
      const response = await API.get('/users/wishlist/share');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get price drop notifications for wishlist items
  getPriceDropNotifications: async () => {
    try {
      const response = await API.get('/users/wishlist/price-drops');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default userService;