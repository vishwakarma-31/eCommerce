const SuccessMetricsService = require('../services/successMetricsService');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get key performance indicators (KPIs)
 * @route   GET /api/metrics/kpis
 * @access  Private/Admin
 */
exports.getKPIs = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.'
    });
  }
  
  try {
    const kpis = await SuccessMetricsService.getKPIs();
    
    res.status(200).json({
      success: true,
      data: kpis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve KPIs',
      error: error.message
    });
  }
});

/**
 * @desc    Get tracking analytics
 * @route   GET /api/metrics/tracking
 * @access  Private/Admin
 */
exports.getTrackingAnalytics = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.'
    });
  }
  
  try {
    const analytics = await SuccessMetricsService.getTrackingAnalytics();
    
    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tracking analytics',
      error: error.message
    });
  }
});

/**
 * @desc    Get user engagement over time
 * @route   GET /api/metrics/engagement
 * @access  Private/Admin
 */
exports.getUserEngagementOverTime = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.'
    });
  }
  
  try {
    const { days = 30 } = req.query;
    const engagementData = await SuccessMetricsService.getUserEngagementOverTime(parseInt(days));
    
    res.status(200).json({
      success: true,
      data: engagementData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user engagement data',
      error: error.message
    });
  }
});

/**
 * @desc    Get conversion funnel data
 * @route   GET /api/metrics/conversion-funnel
 * @access  Private/Admin
 */
exports.getConversionFunnel = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.'
    });
  }
  
  try {
    const funnelData = await SuccessMetricsService.getConversionFunnel();
    
    res.status(200).json({
      success: true,
      data: funnelData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversion funnel data',
      error: error.message
    });
  }
});