const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories');
const { protect, authorize } = require('../middleware/auth');

// Create role-specific middleware
const isAdmin = authorize('Admin');

// GET /api/categories/ - Get all categories
router.get('/', getCategories);

// GET /api/categories/:id - Get category by ID
router.get('/:id', getCategoryById);

// POST /api/categories/ - Create category (Admin only)
router.post('/', protect, isAdmin, createCategory);

// PUT /api/categories/:id - Update category (Admin only)
router.put('/:id', protect, isAdmin, updateCategory);

// DELETE /api/categories/:id - Delete category (Admin only)
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;