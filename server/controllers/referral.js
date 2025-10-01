const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Get user's referral code and link
// @route   GET /api/referral/code
// @access  Private
exports.getReferralCode = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    success: true,
    data: {
      referralCode: user.referralCode,
      referralLink: `${process.env.CLIENT_URL || 'http://localhost:5173'}/register?ref=${user.referralCode}`
    }
  });
});

// @desc    Get referral statistics
// @route   GET /api/referral/stats
// @access  Private
exports.getReferralStats = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  // Get users referred by this user
  const referredUsers = await User.find({ referredBy: req.user.id })
    .select('name email createdAt');
  
  res.status(200).json({
    success: true,
    data: {
      referralCode: user.referralCode,
      referralCount: user.referralCount,
      referredUsers
    }
  });
});

// @desc    Process referral during registration
// @route   POST /api/referral/process
// @access  Public (called during registration)
exports.processReferral = asyncHandler(async (req, res, next) => {
  const { referralCode } = req.body;
  
  if (!referralCode) {
    return next(new ErrorResponse('Referral code is required', 400));
  }
  
  // Find the user who owns this referral code
  const referringUser = await User.findOne({ referralCode });
  
  if (!referringUser) {
    return next(new ErrorResponse('Invalid referral code', 400));
  }
  
  // Prevent self-referral
  if (referringUser._id.toString() === req.body.userId) {
    return next(new ErrorResponse('Cannot refer yourself', 400));
  }
  
  // Update the referring user's referral count
  referringUser.referralCount += 1;
  await referringUser.save();
  
  // Update the new user's referredBy field
  const newUser = await User.findByIdAndUpdate(
    req.body.userId,
    { referredBy: referringUser._id },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    message: `Successfully applied referral code from ${referringUser.name}`
  });
});

// Helper function to generate social sharing meta tags
exports.generateSocialMetaTags = (product, referralCode) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const shareUrl = `${baseUrl}/products/${product.slug}?ref=${referralCode}`;
  
  return {
    title: product.title,
    description: product.description.substring(0, 160),
    image: product.images[0] || '',
    url: shareUrl
  };
};