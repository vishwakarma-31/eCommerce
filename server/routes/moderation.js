const express = require('express');
const {
  flagContent,
  getFlaggedContent,
  bulkAction,
  getActivityLogs,
  contentFilter
} = require('../controllers/moderation');
const { protect, authorize } = require('../middleware/auth');

// Create role-specific middleware
const isAdmin = authorize('Admin');

const router = express.Router();

router.use(protect, isAdmin);

router.route('/flag')
  .post(flagContent);

router.route('/flagged')
  .get(getFlaggedContent);

router.route('/bulk-action')
  .post(bulkAction);

router.route('/logs')
  .get(getActivityLogs);

router.route('/filter')
  .post(contentFilter);

module.exports = router;