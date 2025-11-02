const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

// Create reusable transporter object using the default SMTP transport
let transporter = null;
let fallbackTransporter = null;

// Initialize email transporters
const initializeTransporters = () => {
  try {
    // Primary transporter - Gmail SMTP
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Fallback transporter - SendGrid SMTP
    if (process.env.FALLBACK_EMAIL_HOST) {
      fallbackTransporter = nodemailer.createTransport({
        host: process.env.FALLBACK_EMAIL_HOST,
        port: process.env.FALLBACK_EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: process.env.FALLBACK_EMAIL_USER,
          pass: process.env.FALLBACK_EMAIL_PASS
        }
      });
    }
  } catch (error) {
    logger.error('Failed to initialize email transporters:', error);
  }
};

// Initialize transporters on module load
initializeTransporters();

// Email queue system
const emailQueue = [];
let isProcessingQueue = false;

// Process email queue
const processEmailQueue = async () => {
  if (isProcessingQueue || emailQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  while (emailQueue.length > 0) {
    const email = emailQueue.shift();
    try {
      await sendEmailWithRetry(email);
    } catch (error) {
      logger.error('Failed to send queued email:', error);
    }
  }

  isProcessingQueue = false;
};

// Retry logic for failed emails
const sendEmailWithRetry = async (mailOptions, maxRetries = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Try primary transporter first
      await transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully on attempt ${attempt}`);
      return;
    } catch (error) {
      lastError = error;
      logger.warn(`Email attempt ${attempt} failed:`, error.message);
      
      // If we have a fallback transporter, try it
      if (fallbackTransporter && attempt === maxRetries - 1) {
        try {
          await fallbackTransporter.sendMail(mailOptions);
          logger.info(`Email sent successfully using fallback transporter on attempt ${attempt}`);
          return;
        } catch (fallbackError) {
          logger.error('Fallback transporter also failed:', fallbackError.message);
        }
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  // If we get here, all attempts failed
  throw new Error(`Failed to send email after ${maxRetries} attempts: ${lastError.message}`);
};

// Add email to queue
const queueEmail = (mailOptions) => {
  emailQueue.push(mailOptions);
  // Process queue asynchronously
  setImmediate(processEmailQueue);
};

// Basic email sending function
const sendEmail = async (to, subject, html) => {
  try {
    // Verify transporter is configured
    if (!transporter) {
      throw new Error('Email transporter not initialized');
    }

    const mailOptions = {
      from: `"LaunchPad Market" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    // Queue the email for sending
    queueEmail(mailOptions);
    
    return { success: true };
  } catch (error) {
    logger.error('Error in sendEmail:', error);
    throw error;
  }
};

// Load email template
const loadTemplate = async (templateName, replacements = {}) => {
  try {
    const templatePath = path.join(__dirname, '..', 'emails', `${templateName}.html`);
    let template = await fs.readFile(templatePath, 'utf8');
    
    // Replace placeholders with actual values
    Object.keys(replacements).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, replacements[key]);
    });
    
    return template;
  } catch (error) {
    logger.error(`Error loading template ${templateName}:`, error);
    throw error;
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  try {
    const html = await loadTemplate('welcome', {
      name: user.name,
      email: user.email
    });
    
    return await sendEmail(user.email, 'Welcome to LaunchPad Market!', html);
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    throw error;
  }
};

// Send verification email
const sendVerificationEmail = async (user, token) => {
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    
    const html = await loadTemplate('emailVerification', {
      name: user.name,
      verificationUrl
    });
    
    return await sendEmail(user.email, 'Verify your email address', html);
  } catch (error) {
    logger.error('Error sending verification email:', error);
    throw error;
  }
};

// Send order confirmation
const sendOrderConfirmation = async (order, user) => {
  try {
    // Format order items
    let itemsHtml = '';
    order.items.forEach(item => {
      itemsHtml += `
        <tr>
          <td>${item.product.title}</td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      `;
    });
    
    const html = await loadTemplate('orderConfirmation', {
      name: user.name,
      orderId: order._id,
      items: itemsHtml,
      totalAmount: order.totalAmount.toFixed(2),
      orderDate: new Date(order.createdAt).toLocaleDateString()
    });
    
    return await sendEmail(user.email, 'Order Confirmation', html);
  } catch (error) {
    logger.error('Error sending order confirmation email:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    const html = await loadTemplate('passwordReset', {
      name: user.name,
      resetUrl
    });
    
    return await sendEmail(user.email, 'Password Reset Request', html);
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send shipping notification
const sendShippingNotification = async (order, trackingNumber, user) => {
  try {
    const html = await loadTemplate('orderShipped', {
      name: user.name,
      orderId: order._id,
      trackingNumber,
      estimatedDelivery: new Date(order.estimatedDelivery).toLocaleDateString()
    });
    
    return await sendEmail(user.email, 'Your Order Has Been Shipped', html);
  } catch (error) {
    logger.error('Error sending shipping notification email:', error);
    throw error;
  }
};

// Send delivery notification
const sendDeliveryNotification = async (order, user) => {
  try {
    const html = await loadTemplate('orderDelivered', {
      name: user.name,
      orderId: order._id,
      deliveredDate: new Date(order.deliveredAt).toLocaleDateString()
    });
    
    return await sendEmail(user.email, 'Your Order Has Been Delivered', html);
  } catch (error) {
    logger.error('Error sending delivery notification email:', error);
    throw error;
  }
};

// Send low stock alert to admin
const sendLowStockAlert = async (product, adminEmail) => {
  try {
    const html = await loadTemplate('lowStockAlert', {
      productName: product.title,
      currentStock: product.stockQuantity,
      productId: product._id
    });
    
    return await sendEmail(adminEmail, 'Low Stock Alert', html);
  } catch (error) {
    logger.error('Error sending low stock alert email:', error);
    throw error;
  }
};

// Send newsletter subscription confirmation
const sendNewsletterConfirmation = async (user) => {
  try {
    const html = await loadTemplate('newsletterConfirmation', {
      name: user.name
    });
    
    return await sendEmail(user.email, 'Newsletter Subscription Confirmed', html);
  } catch (error) {
    logger.error('Error sending newsletter confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendOrderConfirmation,
  sendPasswordResetEmail,
  sendShippingNotification,
  sendDeliveryNotification,
  sendLowStockAlert,
  sendNewsletterConfirmation,
  initializeTransporters
};