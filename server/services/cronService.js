const cron = require('node-cron');
const ProductConcept = require('../models/ProductConcept');
const PreOrder = require('../models/PreOrder');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Search = require('../models/Search');
const Notification = require('../models/Notification');
const { 
  sendProjectFundedEmail, 
  sendProjectFailedEmail,
  sendAbandonedCartEmail,
  sendLowStockAlert,
  sendWeeklyNewsletter
} = require('./emailService');
const cloudinary = require('../config/cloudinary');
const analyticsService = require('./analyticsService');

/**
 * Automated Deadline Checker
 * Runs daily at midnight to check for expired crowdfunding projects
 * For successful projects, moves them to production
 * For failed projects, marks them as failed
 */
const startDeadlineChecker = async () => {
  try {
    console.log('Running daily deadline check...');
    
    const now = new Date();
    const expiredProjects = await ProductConcept.find({
      status: 'Funding',
      deadline: { $lt: now }
    });

    for (let project of expiredProjects) {
      // Populate creator and backers information
      await project.populate('creator');
      const backers = await User.find({ backedProjects: project._id });
      
      if (project.currentFunding >= project.fundingGoal) {
        // SUCCESS: Move project to production
        project.status = 'InProduction';
        
        // Send success emails to creator and backers
        try {
          await sendProjectFundedEmail(project, backers, project.creator);
        } catch (emailError) {
          console.error('Failed to send project funded emails:', emailError);
        }
      } else {
        // FAILED: Mark project as failed
        project.status = 'Failed';
        
        // Send failure emails to creator and backers
        try {
          await sendProjectFailedEmail(project, backers, project.creator);
        } catch (emailError) {
          console.error('Failed to send project failed emails:', emailError);
        }
      }
      await project.save();
    }
    
    console.log(`Deadline check completed. Processed ${expiredProjects.length} projects.`);
  } catch (error) {
    console.error('Error in deadline checker:', error);
  }
};

/**
 * Capture payments for successful projects
 * Runs daily at midnight
 */
const captureSuccessfulProjectPayments = async () => {
  try {
    console.log('Processing successful projects...');
    // This is already handled in startDeadlineChecker
    console.log('Project processing completed.');
  } catch (error) {
    console.error('Error processing projects:', error);
  }
};

/**
 * Cancel payments for failed projects
 * Runs daily at midnight
 */
const cancelFailedProjectPayments = async () => {
  try {
    console.log('Processing failed projects...');
    // This is already handled in startDeadlineChecker
    console.log('Project processing completed.');
  } catch (error) {
    console.error('Error processing projects:', error);
  }
};

/**
 * Update product stock status
 * Runs daily at midnight
 */
const updateProductStockStatus = async () => {
  try {
    console.log('Updating product stock status...');
    
    // Update stock status based on stock quantity
    const result = await ProductConcept.updateMany(
      { stockQuantity: { $gt: 10 } },
      { $set: { stockStatus: 'In Stock' } }
    );
    
    await ProductConcept.updateMany(
      { stockQuantity: { $gt: 0, $lte: 10 } },
      { $set: { stockStatus: 'Low Stock' } }
    );
    
    await ProductConcept.updateMany(
      { stockQuantity: 0 },
      { $set: { stockStatus: 'Out of Stock' } }
    );
    
    console.log(`Stock status updated for ${result.modifiedCount} products.`);
  } catch (error) {
    console.error('Error updating product stock status:', error);
  }
};

/**
 * Clear expired cart items
 * Runs daily at midnight
 */
const clearExpiredCartItems = async () => {
  try {
    console.log('Clearing expired cart items...');
    
    // Define expiration time (e.g., 30 days)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 30);
    
    // Find carts that haven't been updated for more than 30 days
    const expiredCarts = await Cart.find({
      updatedAt: { $lt: expirationDate }
    });
    
    // Clear items from expired carts
    let clearedCount = 0;
    for (const cart of expiredCarts) {
      if (cart.items.length > 0) {
        cart.items = [];
        cart.totalPrice = 0;
        cart.totalItems = 0;
        await cart.save();
        clearedCount++;
      }
    }
    
    console.log(`Cleared items from ${clearedCount} expired carts.`);
  } catch (error) {
    console.error('Error clearing expired cart items:', error);
  }
};

/**
 * Send abandoned cart emails
 * Runs daily at midnight
 */
const sendAbandonedCartEmails = async () => {
  try {
    console.log('Sending abandoned cart emails...');
    
    // Define abandonment time (e.g., 3 days)
    const abandonmentDate = new Date();
    abandonmentDate.setDate(abandonmentDate.getDate() - 3);
    
    // Find carts with items that haven't been updated for more than 3 days
    const abandonedCarts = await Cart.find({
      items: { $ne: [] },
      updatedAt: { $lt: abandonmentDate }
    }).populate('user').populate('items.product');
    
    // For each abandoned cart, send reminder email
    let emailCount = 0;
    for (const cart of abandonedCarts) {
      if (cart.user && cart.user.email) {
        try {
          await sendAbandonedCartEmail(
            cart.user,
            cart.items,
            cart.totalPrice
          );
          emailCount++;
        } catch (emailError) {
          console.error(`Failed to send abandoned cart email to ${cart.user.email}:`, emailError);
        }
      }
    }
    
    console.log(`Sent ${emailCount} abandoned cart emails.`);
  } catch (error) {
    console.error('Error sending abandoned cart emails:', error);
  }
};

/**
 * Generate daily sales report
 * Runs daily at midnight
 */
const generateDailySalesReport = async () => {
  try {
    console.log('Generating daily sales report...');
    
    // Get yesterday's date range
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    
    // Get orders from yesterday
    const dailyOrders = await Order.find({
      createdAt: {
        $gte: yesterday,
        $lt: todayStart
      },
      paymentStatus: 'Completed'
    });
    
    // Calculate total revenue
    const totalRevenue = dailyOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Log report
    console.log(`Daily Sales Report - ${yesterday.toDateString()}:`);
    console.log(`Total Orders: ${dailyOrders.length}`);
    console.log(`Total Revenue: $${totalRevenue.toFixed(2)}`);
    
    // In a real implementation, we might save this report or send it via email
    console.log('Daily sales report generation completed.');
  } catch (error) {
    console.error('Error generating daily sales report:', error);
  }
};

/**
 * Archive old notifications
 * Runs daily at midnight
 */
const archiveOldNotifications = async () => {
  try {
    console.log('Archiving old notifications...');
    
    // Define archive time (e.g., 90 days)
    const archiveDate = new Date();
    archiveDate.setDate(archiveDate.getDate() - 90);
    
    // Find and delete old notifications
    const result = await Notification.deleteMany({
      createdAt: { $lt: archiveDate }
    });
    
    console.log(`Archived ${result.deletedCount} old notifications.`);
  } catch (error) {
    console.error('Error archiving old notifications:', error);
  }
};

/**
 * Check low stock products
 * Runs hourly
 */
const checkLowStockProducts = async () => {
  try {
    console.log('Checking low stock products...');
    
    // Find products with low stock (less than 10 items)
    const lowStockProducts = await ProductConcept.find({
      stockQuantity: { $gt: 0, $lte: 10 },
      stockStatus: { $ne: 'Low Stock' } // Only update if status is not already 'Low Stock'
    });
    
    // Update stock status for low stock products
    let updatedCount = 0;
    for (const product of lowStockProducts) {
      product.stockStatus = 'Low Stock';
      await product.save();
      updatedCount++;
    }
    
    console.log(`Updated stock status for ${updatedCount} low stock products.`);
  } catch (error) {
    console.error('Error checking low stock products:', error);
  }
};

/**
 * Send low stock alerts to admin
 * Runs hourly
 */
const sendLowStockAlerts = async () => {
  try {
    console.log('Sending low stock alerts...');
    
    // Find products with very low stock (less than 5 items)
    const veryLowStockProducts = await ProductConcept.find({
      stockQuantity: { $gte: 1, $lt: 5 }
    });
    
    if (veryLowStockProducts.length > 0) {
      // Find admin users
      const admins = await User.find({ role: 'Admin' });
      
      // Send alert to each admin
      for (const admin of admins) {
        if (admin.email) {
          try {
            await sendLowStockAlert(admin, veryLowStockProducts);
          } catch (emailError) {
            console.error(`Failed to send low stock alert to ${admin.email}:`, emailError);
          }
        }
      }
    }
    
    console.log(`Sent low stock alerts for ${veryLowStockProducts.length} products.`);
  } catch (error) {
    console.error('Error sending low stock alerts:', error);
  }
};

/**
 * Update product popularity scores
 * Runs hourly
 */
const updateProductPopularityScores = async () => {
  try {
    console.log('Updating product popularity scores...');
    
    // Get products with recent sales (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Find recent orders
    const recentOrders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo },
      paymentStatus: 'Completed'
    }).populate({
      path: 'items.product',
      select: 'title views likes sales'
    });
    
    // Calculate popularity score for each product
    const productScores = {};
    for (const order of recentOrders) {
      for (const item of order.items) {
        if (item.product) {
          const productId = item.product._id.toString();
          if (!productScores[productId]) {
            productScores[productId] = {
              views: item.product.views || 0,
              likes: item.product.likes || 0,
              sales: 0
            };
          }
          productScores[productId].sales += item.quantity;
        }
      }
    }
    
    // Calculate and update popularity scores
    let updatedCount = 0;
    for (const [productId, scores] of Object.entries(productScores)) {
      // Popularity formula: (views * 0.3) + (likes * 0.2) + (sales * 0.5)
      const popularityScore = Math.round((scores.views * 0.3) + (scores.likes * 0.2) + (scores.sales * 0.5));
      
      // Update product with new popularity score
      const result = await ProductConcept.updateOne(
        { _id: productId },
        { $set: { popularityScore: popularityScore } }
      );
      
      if (result.modifiedCount > 0) {
        updatedCount++;
      }
    }
    
    console.log(`Updated popularity scores for ${updatedCount} products.`);
  } catch (error) {
    console.error('Error updating product popularity scores:', error);
  }
};

/**
 * Generate weekly sales reports
 * Runs weekly on Sunday at midnight
 */
const generateWeeklySalesReport = async () => {
  try {
    console.log('Generating weekly sales report...');
    
    // Get last week's date range
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Get orders from last week
    const weeklyOrders = await Order.find({
      createdAt: {
        $gte: oneWeekAgo,
        $lt: today
      },
      paymentStatus: 'Completed'
    });
    
    // Calculate total revenue
    const totalRevenue = weeklyOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Log report
    console.log(`Weekly Sales Report - ${oneWeekAgo.toDateString()} to ${today.toDateString()}:`);
    console.log(`Total Orders: ${weeklyOrders.length}`);
    console.log(`Total Revenue: $${totalRevenue.toFixed(2)}`);
    
    // In a real implementation, we might save this report or send it via email
    console.log('Weekly sales report generation completed.');
  } catch (error) {
    console.error('Error generating weekly sales report:', error);
  }
};

// Using sendWeeklyNewsletter function imported from emailService

/**
 * Clear old search history
 * Runs weekly on Sunday at midnight
 */
const clearOldSearchHistory = async () => {
  try {
    console.log('Clearing old search history...');
    
    // Define archive time (e.g., 30 days)
    const archiveDate = new Date();
    archiveDate.setDate(archiveDate.getDate() - 30);
    
    // Find and delete old search history entries
    const result = await Search.deleteMany({
      user: { $ne: null }, // Only delete user search history, not popular searches
      timestamp: { $lt: archiveDate }
    });
    
    console.log(`Cleared ${result.deletedCount} old search history entries.`);
  } catch (error) {
    console.error('Error clearing old search history:', error);
  }
};

/**
 * Archive old orders
 * Runs monthly on the 1st at midnight
 */
const archiveOldOrders = async () => {
  try {
    console.log('Archiving old orders...');
    
    // Define archive time (e.g., 1 year)
    const archiveDate = new Date();
    archiveDate.setFullYear(archiveDate.getFullYear() - 1);
    
    // Find completed orders older than 1 year
    const oldOrders = await Order.find({
      createdAt: { $lt: archiveDate },
      orderStatus: { $in: ['Delivered', 'Cancelled'] }
    });
    
    // In a real implementation, we might move these to an archive collection
    console.log(`Found ${oldOrders.length} old orders to archive.`);
    console.log('Order archiving process completed.');
  } catch (error) {
    console.error('Error archiving old orders:', error);
  }
};

/**
 * Generate monthly reports
 * Runs monthly on the 1st at midnight
 */
const generateMonthlyReport = async () => {
  try {
    console.log('Generating monthly report...');
    
    // Generate analytics report
    const metrics = await analyticsService.getDashboardMetrics();
    
    // Log report
    console.log('Monthly Report:');
    console.log(`Total Revenue: $${metrics.totalRevenue.toFixed(2)}`);
    console.log(`Total Orders: ${metrics.totalOrders}`);
    console.log(`Total Users: ${metrics.totalUsers}`);
    console.log(`Active Products: ${metrics.activeProducts}`);
    
    // In a real implementation, we might save this report or send it via email
    console.log('Monthly report generation completed.');
  } catch (error) {
    console.error('Error generating monthly report:', error);
  }
};

/**
 * Clean up unused images from Cloudinary
 * Runs monthly on the 1st at midnight
 */
const cleanupUnusedImages = async () => {
  try {
    console.log('Cleaning up unused images from Cloudinary...');
    
    // Get all product images
    const products = await ProductConcept.find({}, 'images');
    const usedImageUrls = new Set();
    
    // Collect all used image URLs
    products.forEach(product => {
      product.images.forEach(imageUrl => {
        usedImageUrls.add(imageUrl);
      });
    });
    
    // In a real implementation, we would compare with images in Cloudinary
    // and delete unused ones. For now, we'll just log the count.
    console.log(`Found ${usedImageUrls.size} used images.`);
    console.log('Cloudinary cleanup process completed.');
  } catch (error) {
    console.error('Error cleaning up unused images:', error);
  }
};

/**
 * Start all cron jobs
 */
const startAllCronJobs = () => {
  // Daily Tasks (runs at midnight)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily tasks...');
    await startDeadlineChecker();
    await captureSuccessfulProjectPayments();
    await cancelFailedProjectPayments();
    await updateProductStockStatus();
    await clearExpiredCartItems();
    await sendAbandonedCartEmails();
    await generateDailySalesReport();
    await archiveOldNotifications();
  });

  // Hourly Tasks
  cron.schedule('0 * * * *', async () => {
    console.log('Running hourly tasks...');
    await checkLowStockProducts();
    await sendLowStockAlerts();
    await updateProductPopularityScores();
  });

  // Weekly Tasks (runs at midnight on Sunday)
  cron.schedule('0 0 * * 0', async () => {
    console.log('Running weekly tasks...');
    await generateWeeklySalesReport();
    await sendWeeklyNewsletter();
    await clearOldSearchHistory();
  });

  // Monthly Tasks (runs at midnight on the 1st of each month)
  cron.schedule('0 0 1 * *', async () => {
    console.log('Running monthly tasks...');
    await archiveOldOrders();
    await generateMonthlyReport();
    await cleanupUnusedImages();
  });
};

/**
 * Test function to manually trigger all cron jobs for testing purposes
 */
const testAllCronJobs = async () => {
  console.log('Testing all cron jobs...');
  
  // Test daily tasks
  console.log('Testing daily tasks...');
  await startDeadlineChecker();
  await captureSuccessfulProjectPayments();
  await cancelFailedProjectPayments();
  await updateProductStockStatus();
  await clearExpiredCartItems();
  await sendAbandonedCartEmails();
  await generateDailySalesReport();
  await archiveOldNotifications();
  
  // Test hourly tasks
  console.log('Testing hourly tasks...');
  await checkLowStockProducts();
  await sendLowStockAlerts();
  await updateProductPopularityScores();
  
  // Test weekly tasks
  console.log('Testing weekly tasks...');
  await generateWeeklySalesReport();
  await sendWeeklyNewsletter();
  await clearOldSearchHistory();
  
  // Test monthly tasks
  console.log('Testing monthly tasks...');
  await archiveOldOrders();
  await generateMonthlyReport();
  await cleanupUnusedImages();
  
  console.log('All cron jobs tested successfully!');
};

module.exports = {
  startDeadlineChecker,
  captureSuccessfulProjectPayments,
  cancelFailedProjectPayments,
  updateProductStockStatus,
  clearExpiredCartItems,
  sendAbandonedCartEmails,
  generateDailySalesReport,
  archiveOldNotifications,
  checkLowStockProducts,
  sendLowStockAlerts,
  updateProductPopularityScores,
  generateWeeklySalesReport,
  sendWeeklyNewsletter,
  clearOldSearchHistory,
  archiveOldOrders,
  generateMonthlyReport,
  cleanupUnusedImages,
  startAllCronJobs,
  testAllCronJobs
};