const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  getNotificationPreferences,
  updateNotificationPreferences,
  getNotificationCount
} = require('../controllers/notifications');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotifications);

router.route('/count')
  .get(getNotificationCount);

router.route('/preferences')
  .get(getNotificationPreferences)
  .put(updateNotificationPreferences);

router.route('/:id/read')
  .put(markAsRead);

router.route('/:id/unread')
  .put(markAsUnread);

router.route('/read-all')
  .put(markAllAsRead);

router.route('/delete-read')
  .delete(deleteReadNotifications);

router.route('/:id')
  .delete(deleteNotification);

module.exports = router;