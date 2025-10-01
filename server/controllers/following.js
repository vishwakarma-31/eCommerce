const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Follow a user (creator)
// @route   POST /api/following/:id
// @access  Private
exports.followUser = asyncHandler(async (req, res, next) => {
  const userToFollow = await User.findById(req.params.id);
  
  if (!userToFollow) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  // Prevent users from following themselves
  if (userToFollow._id.toString() === req.user.id) {
    return next(new ErrorResponse('You cannot follow yourself', 400));
  }
  
  // Check if already following
  if (req.user.following.includes(userToFollow._id)) {
    return next(new ErrorResponse('You are already following this user', 400));
  }
  
  // Add to following array
  req.user.following.push(userToFollow._id);
  await req.user.save();
  
  res.status(200).json({
    success: true,
    message: `You are now following ${userToFollow.name}`
  });
});

// @desc    Unfollow a user (creator)
// @route   DELETE /api/following/:id
// @access  Private
exports.unfollowUser = asyncHandler(async (req, res, next) => {
  const userToUnfollow = await User.findById(req.params.id);
  
  if (!userToUnfollow) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  // Check if not following
  if (!req.user.following.includes(userToUnfollow._id)) {
    return next(new ErrorResponse('You are not following this user', 400));
  }
  
  // Remove from following array
  req.user.following = req.user.following.filter(
    id => id.toString() !== userToUnfollow._id.toString()
  );
  await req.user.save();
  
  res.status(200).json({
    success: true,
    message: `You have unfollowed ${userToUnfollow.name}`
  });
});

// @desc    Get following list
// @route   GET /api/following
// @access  Private
exports.getFollowing = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'following',
    select: 'name email profileImage bio'
  });
  
  res.status(200).json({
    success: true,
    count: user.following.length,
    data: user.following
  });
});

// @desc    Get activity feed for followed creators
// @route   GET /api/following/feed
// @access  Private
exports.getFollowingFeed = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  // Get the users that the current user is following
  const currentUser = await User.findById(req.user.id);
  const followingIds = currentUser.following;
  
  // Get products from followed creators
  const products = await Product.find({
    creator: { $in: followingIds },
    isApproved: true
  })
    .populate({
      path: 'creator',
      select: 'name profileImage'
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  const total = await Product.countDocuments({
    creator: { $in: followingIds },
    isApproved: true
  });
  
  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: products
  });
});

// Helper function to notify followers when a creator launches a new product
exports.notifyFollowersOfNewProduct = async (productId) => {
  try {
    const product = await Product.findById(productId).populate('creator', 'name');
    if (!product) return;
    
    // Get all users following this creator
    const followers = await User.find({ following: product.creator._id });
    
    // Create notification for each follower
    for (const follower of followers) {
      // This would use the notification system we created earlier
      // We'll implement this fully when we integrate all systems
      console.log(`Notifying ${follower.name} about new product from ${product.creator.name}`);
    }
  } catch (error) {
    console.error('Error notifying followers of new product:', error);
  }
};