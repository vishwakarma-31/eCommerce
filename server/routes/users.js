const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getRecommendations,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  suspendUser
} = require('../controllers/users');
const { protect, isAdmin, isBacker } = require('../middleware/auth');
const { upload, processImages } = require('../middleware/imageUpload');

// GET /api/users/:id/profile - Get public user profile
router.get('/:id/profile', getUserProfile);

// PUT /api/users/profile - Update own profile (protected)
router.put('/profile', protect, isBacker, updateUserProfile);

// POST /api/users/profile/image - Upload profile image (protected)
router.post('/profile/image', protect, isBacker, upload.single('image'), processImages, uploadProfileImage);

// GET /api/users/wishlist - Get user's wishlist (protected)
router.get('/wishlist', protect, isBacker, getWishlist);

// POST /api/users/wishlist/:productId - Add to wishlist (protected)
router.post('/wishlist/:productId', protect, isBacker, addToWishlist);

// DELETE /api/users/wishlist/:productId - Remove from wishlist (protected)
router.delete('/wishlist/:productId', protect, isBacker, removeFromWishlist);

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