const express = require('express');
const router = express.Router();
const {
  getKPIs,
  getTrackingAnalytics,
  getUserEngagementOverTime,
  getConversionFunnel
} = require('../controllers/successMetrics');
const { protect, authorize } = require('../middleware/auth');

// Create role-specific middleware
const isAdmin = authorize('Admin');

// All routes require admin authentication
router.use(protect);
router.use(isAdmin);

// KPIs route
router.get('/kpis', getKPIs);

// Tracking analytics route
router.get('/tracking', getTrackingAnalytics);

// User engagement over time route
router.get('/engagement', getUserEngagementOverTime);

// Conversion funnel route
router.get('/conversion-funnel', getConversionFunnel);

module.exports = router;