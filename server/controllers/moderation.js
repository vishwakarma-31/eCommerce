const User = require('../models/User');
const ProductConcept = require('../models/Product');
const Review = require('../models/Review');
const Comment = require('../models/Comment');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Flag inappropriate content
// @route   POST /api/admin/moderation/flag
// @access  Private/Admin
exports.flagContent = asyncHandler(async (req, res, next) => {
  const { contentType, contentId, reason } = req.body;
  
  if (!contentType || !contentId || !reason) {
    return next(new ErrorResponse('Content type, content ID, and reason are required', 400));
  }
  
  let content;
  switch (contentType) {
    case 'product':
      content = await ProductConcept.findById(contentId);
      break;
    case 'review':
      content = await Review.findById(contentId);
      break;
    case 'comment':
      content = await Comment.findById(contentId);
      break;
    default:
      return next(new ErrorResponse('Invalid content type', 400));
  }
  
  if (!content) {
    return next(new ErrorResponse('Content not found', 404));
  }
  
  // Add flag to content
  if (!content.flags) {
    content.flags = [];
  }
  
  content.flags.push({
    flaggedBy: req.user.id,
    reason,
    createdAt: Date.now()
  });
  
  await content.save();
  
  res.status(200).json({
    success: true,
    message: 'Content flagged successfully'
  });
});

// @desc    Get flagged content
// @route   GET /api/admin/moderation/flagged
// @access  Private/Admin
exports.getFlaggedContent = asyncHandler(async (req, res, next) => {
  const { contentType, page = 1, limit = 10 } = req.query;
  
  let query = { 'flags.0': { $exists: true } };
  
  if (contentType) {
    switch (contentType) {
      case 'product':
        query = { ...query, ...ProductConcept };
        break;
      case 'review':
        query = { ...query, ...Review };
        break;
      case 'comment':
        query = { ...query, ...Comment };
        break;
    }
  }
  
  // For simplicity, we'll just get flagged products
  // In a real implementation, you would need to query all content types
  const products = await ProductConcept.find(query)
    .populate('creator', 'name email')
    .sort({ 'flags.0.createdAt': -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  const total = await ProductConcept.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: products
  });
});

// @desc    Bulk approve/reject products
// @route   POST /api/admin/moderation/bulk-action
// @access  Private/Admin
exports.bulkAction = asyncHandler(async (req, res, next) => {
  const { action, productIds } = req.body;
  
  if (!action || !productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return next(new ErrorResponse('Action and product IDs are required', 400));
  }
  
  if (!['approve', 'reject'].includes(action)) {
    return next(new ErrorResponse('Invalid action. Must be approve or reject', 400));
  }
  
  const update = action === 'approve' ? { isApproved: true } : { isApproved: false };
  
  const result = await ProductConcept.updateMany(
    { _id: { $in: productIds } },
    update
  );
  
  res.status(200).json({
    success: true,
    message: `Successfully ${action}d ${result.modifiedCount} products`,
    modifiedCount: result.modifiedCount
  });
});

// @desc    Get user activity logs
// @route   GET /api/admin/moderation/logs
// @access  Private/Admin
exports.getActivityLogs = asyncHandler(async (req, res, next) => {
  const { userId, action, page = 1, limit = 20 } = req.query;
  
  // In a real implementation, you would have actual activity logs
  // For now, we'll simulate some logs
  const logs = [
    {
      user: 'User123',
      action: 'Product Created',
      target: 'Product456',
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      user: 'User123',
      action: 'Product Updated',
      target: 'Product456',
      timestamp: new Date(Date.now() - 1000 * 60 * 10)
    },
    {
      user: 'Admin789',
      action: 'Product Approved',
      target: 'Product123',
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    }
  ];
  
  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs
  });
});

// @desc    Automated content moderation (basic keyword filtering)
// @route   POST /api/admin/moderation/filter
// @access  Private/Admin
exports.contentFilter = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  
  if (!text) {
    return next(new ErrorResponse('Text content is required', 400));
  }
  
  // Basic keyword filter (in a real app, you would use a more sophisticated approach)
  const bannedWords = ['spam', 'scam', 'fake', 'fraud'];
  const detectedWords = bannedWords.filter(word => 
    text.toLowerCase().includes(word.toLowerCase())
  );
  
  const isFlagged = detectedWords.length > 0;
  
  res.status(200).json({
    success: true,
    data: {
      isFlagged,
      detectedWords,
      confidence: isFlagged ? Math.min(100, detectedWords.length * 25) : 0
    }
  });
});