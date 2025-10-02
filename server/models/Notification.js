const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'FUNDING_MILESTONE',
      'NEW_COMMENT',
      'ORDER_STATUS_UPDATE',
      'NEW_PRODUCT',
      'ADMIN_ANNOUNCEMENT',
      'FOLLOWED_CREATOR_NEW_PROJECT'
    ]
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedId: {
    // ID of the related entity (product, order, comment, etc.)
    type: mongoose.Schema.Types.ObjectId
  },
  relatedType: {
    // Type of the related entity
    type: String,
    enum: ['Product', 'Order', 'Comment', 'User']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  metadata: {
    // Additional data for the notification
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Add indexes for efficient querying
notificationSchema.index({ user: 1, isRead: 1 }); // Index for querying by user and read status
notificationSchema.index({ user: 1, createdAt: -1 }); // Index for querying by user and sorting by date
notificationSchema.index({ type: 1 }); // Index for querying by notification type

module.exports = mongoose.model('Notification', notificationSchema);