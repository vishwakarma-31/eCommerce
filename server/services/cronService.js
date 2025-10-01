const cron = require('node-cron');
const ProductConcept = require('../models/ProductConcept');
const PreOrder = require('../models/PreOrder');
const User = require('../models/User');
const { captureAllPreOrderPayments, cancelAllPreOrderPayments } = require('./paymentService');
const { 
  sendProjectFundedEmail, 
  sendProjectFailedEmail 
} = require('./emailService');

/**
 * Automated Deadline Checker
 * Runs daily at midnight to check for expired crowdfunding projects
 * For successful projects, captures all authorized payments
 * For failed projects, cancels all authorized payments
 */
const startDeadlineChecker = () => {
  // Check all products with status 'Funding' and passed deadline
  cron.schedule('0 0 * * *', async () => {
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
          // SUCCESS: Capture all authorized payments
          project.status = 'Successful';
          await captureAllPreOrderPayments(project._id);
          
          // Send success emails to creator and backers
          try {
            await sendProjectFundedEmail(project, backers, project.creator);
          } catch (emailError) {
            console.error('Failed to send project funded emails:', emailError);
          }
          
          // Update status to 'InProduction'
          project.status = 'InProduction';
        } else {
          // FAILED: Cancel all payment intents
          project.status = 'Failed';
          await cancelAllPreOrderPayments(project._id);
          
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
  });
};

module.exports = {
  startDeadlineChecker
};