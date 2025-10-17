const Notification = require('../models/Notification');
const User = require('../models/User');
const Product = require('../models/ProductConcept');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;
  
  const query = { user: req.user.id };
  if (unreadOnly === 'true') {
    query.isRead = false;
  }
  
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate({
      path: 'relatedId',
      select: 'title name email'
    });
  
  const total = await Notification.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: notifications
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user.id
  });
  
  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }
  
  notification.isRead = true;
  await notification.save();
  
  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark notification as unread
// @route   PUT /api/notifications/:id/unread
// @access  Private
exports.markAsUnread = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user.id
  });
  
  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }
  
  notification.isRead = false;
  await notification.save();
  
  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { isRead: true }
  );
  
  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user.id
  });
  
  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }
  
  await notification.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Delete all read notifications
// @route   DELETE /api/notifications/delete-read
// @access  Private
exports.deleteReadNotifications = asyncHandler(async (req, res, next) => {
  const result = await Notification.deleteMany({
    user: req.user.id,
    isRead: true
  });
  
  res.status(200).json({
    success: true,
    message: `${result.deletedCount} read notifications deleted`
  });
});

// @desc    Get notification preferences
// @route   GET /api/notifications/preferences
// @access  Private
exports.getNotificationPreferences = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: {
      emailNotifications: user.emailPreferences?.notifications ?? true,
      pushNotifications: user.pushNotifications ?? true,
      inAppNotifications: user.inAppNotifications ?? true
    }
  });
});

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
exports.updateNotificationPreferences = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  const { emailNotifications, pushNotifications, inAppNotifications } = req.body;
  
  // Update user preferences
  if (emailNotifications !== undefined) {
    user.emailPreferences = {
      ...user.emailPreferences,
      notifications: emailNotifications
    };
  }
  
  if (pushNotifications !== undefined) {
    user.pushNotifications = pushNotifications;
  }
  
  if (inAppNotifications !== undefined) {
    user.inAppNotifications = inAppNotifications;
  }
  
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Notification preferences updated successfully',
    data: {
      emailNotifications: user.emailPreferences?.notifications ?? true,
      pushNotifications: user.pushNotifications ?? true,
      inAppNotifications: user.inAppNotifications ?? true
    }
  });
});

// @desc    Get notification count
// @route   GET /api/notifications/count
// @access  Private
exports.getNotificationCount = asyncHandler(async (req, res, next) => {
  const unreadCount = await Notification.countDocuments({
    user: req.user.id,
    isRead: false
  });
  
  res.status(200).json({
    success: true,
    data: {
      unreadCount
    }
  });
});

// Helper function to create a notification
exports.createNotification = async (userId, type, title, message, relatedId = null, relatedType = null, metadata = {}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      relatedId,
      relatedType,
      metadata
    });
    
    // In a real app, you would emit this via WebSocket for real-time updates
    // io.to(`user_${userId}`).emit('newNotification', notification);
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Helper function to create funding milestone notifications
exports.createFundingMilestoneNotification = async (productId, milestone) => {
  try {
    const product = await Product.findById(productId).populate('creator', 'name');
    if (!product) return;
    
    const backers = await User.find({ backedProjects: productId });
    
    for (const backer of backers) {
      await exports.createNotification(
        backer._id,
        'FUNDING_MILESTONE',
        'Funding Milestone Reached!',
        `The project "${product.title}" you backed has reached ${milestone}% funding!`,
        product._id,
        'Product',
        { milestone, productId: product._id }
      );
    }
  } catch (error) {
    console.error('Error creating funding milestone notifications:', error);
  }
};

// Helper function to create new comment notifications
exports.createNewCommentNotification = async (comment) => {
  try {
    const product = await Product.findById(comment.product).populate('creator', 'name');
    if (!product) return;
    
    // Notify the product creator
    await exports.createNotification(
      product.creator._id,
      'NEW_COMMENT',
      'New Comment on Your Project',
      `${comment.author.name} commented on your project "${product.title}"`,
      comment._id,
      'Comment',
      { productId: product._id, commentId: comment._id }
    );
    
    // Notify other commenters on the same product
    const otherComments = await Comment.find({
      product: product._id,
      author: { $ne: product.creator._id }
    }).populate('author', 'name');
    
    const uniqueAuthors = [...new Set(otherComments.map(c => c.author._id.toString()))];
    
    for (const authorId of uniqueAuthors) {
      if (authorId !== comment.author._id.toString()) {
        await exports.createNotification(
          authorId,
          'NEW_COMMENT',
          'New Reply to Discussion',
          `${comment.author.name} replied to a comment on "${product.title}"`,
          comment._id,
          'Comment',
          { productId: product._id, commentId: comment._id }
        );
      }
    }
  } catch (error) {
    console.error('Error creating new comment notifications:', error);
  }
};

// Helper function to create order status update notifications
exports.createOrderStatusUpdateNotification = async (orderId, newStatus) => {
  try {
    const order = await Order.findById(orderId).populate('user', 'name');
    if (!order) return;
    
    const statusMessages = {
      'Processing': 'Your order is now being processed',
      'Shipped': 'Your order has been shipped',
      'Delivered': 'Your order has been delivered',
      'Cancelled': 'Your order has been cancelled'
    };
    
    await exports.createNotification(
      order.user._id,
      'ORDER_STATUS_UPDATE',
      'Order Status Updated',
      `Order #${order._id} ${statusMessages[newStatus] || `status changed to ${newStatus}`}`,
      order._id,
      'Order',
      { orderId: order._id, newStatus }
    );
  } catch (error) {
    console.error('Error creating order status update notifications:', error);
  }
};