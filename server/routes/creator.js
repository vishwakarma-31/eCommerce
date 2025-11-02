const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getProjects,
  getProductAnalytics,
  getEarnings
} = require('../controllers/creator');
const {
  getCreatorAnalytics
} = require('../controllers/creatorAnalytics');
const { protect, authorize } = require('../middleware/auth');

// Create role-specific middleware
const isCreator = authorize('Creator', 'Admin');

// GET /api/creator/dashboard - Get creator dashboard overview (Creator only)
router.get('/dashboard', protect, isCreator, getDashboard);

// GET /api/creator/analytics - Get creator analytics dashboard (Creator only)
router.get('/analytics', protect, isCreator, getCreatorAnalytics);

// GET /api/creator/projects - Get all creator's projects (Creator only)
router.get('/projects', protect, isCreator, getProjects);

// GET /api/creator/analytics/:productId - Get product analytics (Creator only)
router.get('/analytics/:productId', protect, isCreator, getProductAnalytics);

// GET /api/creator/earnings - Get earnings summary (Creator only)
router.get('/earnings', protect, isCreator, getEarnings);

module.exports = router;