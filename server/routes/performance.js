const express = require('express');
const router = express.Router();
const { performanceMonitor } = require('../utils/performanceMonitor');
const { protect, authorize } = require('../middleware/auth');

// Create role-specific middleware
const isAdmin = authorize('Admin');

/**
 * @route   GET /api/performance/metrics
 * @desc    Get performance metrics
 * @access  Admin
 */
router.get('/metrics', protect, isAdmin, (req, res) => {
  try {
    const metrics = performanceMonitor.getMetrics();
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve performance metrics'
    });
  }
});

/**
 * @route   POST /api/performance/reset
 * @desc    Reset performance metrics
 * @access  Admin
 */
router.post('/reset', protect, isAdmin, (req, res) => {
  try {
    performanceMonitor.resetMetrics();
    res.json({
      success: true,
      message: 'Performance metrics reset successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to reset performance metrics'
    });
  }
});

module.exports = router;