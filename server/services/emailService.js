const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

/**
 * Create a transporter for sending emails
 * Uses environment variables for configuration
 */
const createTransporter = () => {
  // For development, we can use Ethereal.email or similar services
  // In production, use actual email service like SendGrid, AWS SES, etc.
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || 'test@example.com',
      pass: process.env.EMAIL_PASS || 'password'
    }
  });

  return transporter;
};

/**
 * Read an email template from the filesystem
 * @param {string} templateName - Name of the template file (without extension)
 * @returns {Promise<string>} - Template content
 */
const readTemplate = async (templateName) => {
  try {
    const templatePath = path.join(__dirname, '..', 'emails', `${templateName}.html`);
    const template = await fs.readFile(templatePath, 'utf8');
    return template;
  } catch (error) {
    console.error(`Error reading template ${templateName}:`, error);
    throw new Error(`Template ${templateName} not found`);
  }
};

/**
 * Replace placeholders in template with actual values
 * @param {string} template - HTML template with placeholders
 * @param {Object} data - Data to replace placeholders
 * @returns {string} - Template with replaced values
 */
const compileTemplate = (template, data) => {
  let compiledTemplate = template;
  
  // Replace all placeholders in the format {{key}} with corresponding values
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    compiledTemplate = compiledTemplate.replace(regex, value || '');
  }
  
  return compiledTemplate;
};

/**
 * Send an email using the configured transporter
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.template - Template name
 * @param {Object} options.data - Data to populate template
 * @returns {Promise<Object>} - Mail sending result
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // Read and compile template
    const template = await readTemplate(options.template);
    const html = compileTemplate(template, options.data);
    
    // Prepare mail options
    const mailOptions = {
      from: `"LaunchPad Market" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@launchpadmarket.com'}>`,
      to: options.to,
      subject: options.subject,
      html: html
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send welcome email to new user
 * @param {Object} user - User object
 */
const sendWelcomeEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to LaunchPad Market!',
    template: 'welcome',
    data: {
      name: user.name,
      email: user.email,
      clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
    }
  });
};

/**
 * Send project funded successfully email to creator and backers
 * @param {Object} project - Project object
 * @param {Array} backers - Array of backers
 * @param {Object} creator - Creator object
 */
const sendProjectFundedEmail = async (project, backers, creator) => {
  // Send to creator
  await sendEmail({
    to: creator.email,
    subject: `Your project "${project.title}" has been successfully funded!`,
    template: 'projectFunded',
    data: {
      name: creator.name,
      projectName: project.title,
      fundingGoal: project.fundingGoal,
      currentFunding: project.currentFunding,
      projectUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/products/${project.slug}`
    }
  });
  
  // Send to backers
  for (const backer of backers) {
    await sendEmail({
      to: backer.email,
      subject: `The project "${project.title}" you backed has been funded!`,
      template: 'projectFundedBacker',
      data: {
        name: backer.name,
        projectName: project.title,
        projectUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/products/${project.slug}`
      }
    });
  }
};

/**
 * Send project failed email to creator and backers
 * @param {Object} project - Project object
 * @param {Array} backers - Array of backers
 * @param {Object} creator - Creator object
 */
const sendProjectFailedEmail = async (project, backers, creator) => {
  // Send to creator
  await sendEmail({
    to: creator.email,
    subject: `Your project "${project.title}" did not reach its funding goal`,
    template: 'projectFailed',
    data: {
      name: creator.name,
      projectName: project.title,
      fundingGoal: project.fundingGoal,
      currentFunding: project.currentFunding,
      projectUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/products/${project.slug}`
    }
  });
  
  // Send to backers
  for (const backer of backers) {
    await sendEmail({
      to: backer.email,
      subject: `The project "${project.title}" you backed did not reach its funding goal`,
      template: 'projectFailedBacker',
      data: {
        name: backer.name,
        projectName: project.title,
        projectUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/products/${project.slug}`
      }
    });
  }
};

/**
 * Send order confirmation email
 * @param {Object} order - Order object
 * @param {Object} user - User object
 */
const sendOrderConfirmationEmail = async (order, user) => {
  await sendEmail({
    to: user.email,
    subject: `Order Confirmation #${order._id}`,
    template: 'orderConfirmation',
    data: {
      name: user.name,
      orderId: order._id,
      totalAmount: order.totalAmount,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      orderUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/orders/${order._id}`
    }
  });
};

/**
 * Send order shipped email with tracking number
 * @param {Object} order - Order object
 * @param {Object} user - User object
 */
const sendOrderShippedEmail = async (order, user) => {
  await sendEmail({
    to: user.email,
    subject: `Your order #${order._id} has been shipped!`,
    template: 'orderShipped',
    data: {
      name: user.name,
      orderId: order._id,
      trackingNumber: order.trackingNumber || 'Not available yet',
      estimatedDelivery: order.estimatedDelivery 
        ? new Date(order.estimatedDelivery).toLocaleDateString() 
        : 'To be determined',
      orderUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/orders/${order._id}`
    }
  });
};

/**
 * Send order delivered email
 * @param {Object} order - Order object
 * @param {Object} user - User object
 */
const sendOrderDeliveredEmail = async (order, user) => {
  await sendEmail({
    to: user.email,
    subject: `Your order #${order._id} has been delivered!`,
    template: 'orderDelivered',
    data: {
      name: user.name,
      orderId: order._id,
      deliveredAt: order.deliveredAt 
        ? new Date(order.deliveredAt).toLocaleDateString() 
        : new Date().toLocaleDateString(),
      orderUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/orders/${order._id}`
    }
  });
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} resetToken - Password reset token
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    template: 'passwordReset',
    data: {
      name: user.name,
      resetUrl: resetUrl,
      expiresIn: '10 minutes'
    }
  });
};

/**
 * Send new comment notification email
 * @param {Object} comment - Comment object
 * @param {Object} user - User object (recipient)
 * @param {Object} project - Project object
 */
const sendNewCommentEmail = async (comment, user, project) => {
  await sendEmail({
    to: user.email,
    subject: `New comment on your project "${project.title}"`,
    template: 'newComment',
    data: {
      name: user.name,
      commenterName: comment.author.name,
      projectName: project.title,
      comment: comment.text,
      projectUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/products/${project.slug}`
    }
  });
};

/**
 * Send project update email to backers
 * @param {Object} project - Project object
 * @param {Array} backers - Array of backers
 * @param {string} updateTitle - Title of the update
 * @param {string} updateContent - Content of the update
 */
const sendProjectUpdateEmail = async (project, backers, updateTitle, updateContent) => {
  for (const backer of backers) {
    await sendEmail({
      to: backer.email,
      subject: `Update for "${project.title}" - ${updateTitle}`,
      template: 'projectUpdate',
      data: {
        name: backer.name,
        projectName: project.title,
        creatorName: project.creator.name,
        updateTitle: updateTitle,
        updateContent: updateContent,
        projectUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/products/${project.slug}`
      }
    });
  }
};

/**
 * Send abandoned cart email
 * @param {Object} user - User object
 * @param {Array} cartItems - Array of cart items
 * @param {Number} totalPrice - Total price of cart
 */
const sendAbandonedCartEmail = async (user, cartItems, totalPrice) => {
  await sendEmail({
    to: user.email,
    subject: 'Complete Your Purchase - Items Still in Your Cart',
    template: 'abandonedCart',
    data: {
      name: user.name,
      cartItems: cartItems.map(item => ({
        name: item.product.title,
        price: item.price,
        quantity: item.quantity
      })),
      totalPrice: totalPrice,
      cartUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/cart`
    }
  });
};

/**
 * Send low stock alert to admin
 * @param {Object} admin - Admin user object
 * @param {Array} lowStockProducts - Array of low stock products
 */
const sendLowStockAlert = async (admin, lowStockProducts) => {
  await sendEmail({
    to: admin.email,
    subject: 'Low Stock Alert - Action Required',
    template: 'lowStockAlert',
    data: {
      adminName: admin.name,
      lowStockProducts: lowStockProducts,
      adminDashboardUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/products`
    }
  });
};

/**
 * Send weekly newsletter to subscriber
 * @param {Object} user - User object
 * @param {Object} newsletterData - Newsletter data including featured products, stats, etc.
 */
const sendWeeklyNewsletter = async (user, newsletterData) => {
  await sendEmail({
    to: user.email,
    subject: 'Weekly Newsletter - New Products & Innovations',
    template: 'weeklyNewsletter',
    data: {
      name: user.name,
      ...newsletterData,
      shopUrl: process.env.CLIENT_URL || 'http://localhost:5173',
      unsubscribeUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/unsubscribe`,
      preferencesUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/preferences`
    }
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendProjectFundedEmail,
  sendProjectFailedEmail,
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendPasswordResetEmail,
  sendNewCommentEmail,
  sendProjectUpdateEmail,
  sendAbandonedCartEmail,
  sendLowStockAlert,
  sendWeeklyNewsletter
};