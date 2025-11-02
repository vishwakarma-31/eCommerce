const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveWishlistItemToCart,
  shareWishlist,
  getPriceDropNotifications,
  getRecommendations,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  suspendUser,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  updateEmailPreferences,
  deleteAccount,
  getRecentlyViewed,
  addRecentlyViewed,
  clearRecentlyViewed
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

// Create role-specific middleware
const isAdmin = authorize('Admin');
const isBacker = authorize('Backer', 'Creator', 'Admin');
const { upload, processImages } = require('../middleware/imageUpload');

// GET /api/users/:id/profile - Get public user profile
router.get('/:id/profile', getUserProfile);

// PUT /api/users/profile - Update own profile (protected)
router.put('/profile', protect, isBacker, updateUserProfile);

// PUT /api/users/profile/password - Change password (protected)
router.put('/profile/password', protect, isBacker, changePassword);

// POST /api/users/profile/image - Upload profile image (protected)
router.post('/profile/image', protect, isBacker, upload.single('image'), processImages, uploadProfileImage);

// POST /api/users/profile/addresses - Add address (protected)
router.post('/profile/addresses', protect, isBacker, addAddress);

// PUT /api/users/profile/addresses/:addressId - Update address (protected)
router.put('/profile/addresses/:addressId', protect, isBacker, updateAddress);

// DELETE /api/users/profile/addresses/:addressId - Delete address (protected)
router.delete('/profile/addresses/:addressId', protect, isBacker, deleteAddress);

// PUT /api/users/profile/addresses/:addressId/default - Set default address (protected)
router.put('/profile/addresses/:addressId/default', protect, isBacker, setDefaultAddress);

// PUT /api/users/profile/email-preferences - Update email preferences (protected)
router.put('/profile/email-preferences', protect, isBacker, updateEmailPreferences);

// DELETE /api/users/profile/account - Delete account (protected)
router.delete('/profile/account', protect, isBacker, deleteAccount);

// GET /api/users/recently-viewed - Get recently viewed products (protected)
router.get('/recently-viewed', protect, isBacker, getRecentlyViewed);

// POST /api/users/recently-viewed/:productId - Add product to recently viewed (protected)
router.post('/recently-viewed/:productId', protect, isBacker, addRecentlyViewed);

// DELETE /api/users/recently-viewed - Clear recently viewed history (protected)
router.delete('/recently-viewed', protect, isBacker, clearRecentlyViewed);

// GET /api/users/wishlist - Get user's wishlist (protected)
router.get('/wishlist', protect, isBacker, getWishlist);

// POST /api/users/wishlist/:productId - Add to wishlist (protected)
router.post('/wishlist/:productId', protect, isBacker, addToWishlist);

// DELETE /api/users/wishlist/:productId - Remove from wishlist (protected)
router.delete('/wishlist/:productId', protect, isBacker, removeFromWishlist);

// POST /api/users/wishlist/:productId/move-to-cart - Move wishlist item to cart (protected)
router.post('/wishlist/:productId/move-to-cart', protect, isBacker, moveWishlistItemToCart);

// GET /api/users/wishlist/share - Share wishlist (protected)
router.get('/wishlist/share', protect, isBacker, shareWishlist);

// GET /api/users/wishlist/price-drops - Get price drop notifications (protected)
router.get('/wishlist/price-drops', protect, isBacker, getPriceDropNotifications);

// GET /api/users/recommendations - Get personalized recommendations (protected)
router.get('/recommendations', protect, isBacker, getRecommendations);

// GET /api/users - Get all users (admin only)
router.get('/', protect, isAdmin, getUsers);

// GET /api/users/:id - Get user by ID (admin only)
router.get('/:id', protect, isAdmin, getUserById);

// PUT /api/users/:id - Update user (admin only)
router.put('/:id', protect, isAdmin, updateUser);

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', protect, isAdmin, deleteUser);

// PUT /api/users/:id/suspend - Suspend user (admin only)
router.put('/:id/suspend', protect, isAdmin, suspendUser);

module.exports = router;