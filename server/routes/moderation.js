const express = require('express');
const {
  flagContent,
  getFlaggedContent,
  bulkAction,
  getActivityLogs,
  contentFilter
} = require('../controllers/moderation');
const { protect, isAdmin } = require('../middleware/auth');

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