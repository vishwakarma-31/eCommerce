const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('paypal-rest-sdk');
const PreOrder = require('../models/PreOrder');
const ProductConcept = require('../models/ProductConcept');
const Order = require('../models/Order');
const logger = require('../utils/logger');

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox', // sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

/**
 * Create a payment intent for Stripe
 * @param {Object} paymentData - Payment data including amount, currency, and metadata
 * @returns {Object} Stripe payment intent
 */
const createStripePaymentIntent = async (paymentData) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentData.amount,
      currency: paymentData.currency || 'usd',
      capture_method: paymentData.captureMethod || 'automatic',
      metadata: paymentData.metadata || {}
    });
    
    return paymentIntent;
  } catch (error) {
    logger.error('Error creating Stripe payment intent:', error);
    throw error;
  }
};

/**
 * Create a PayPal payment
 * @param {Object} paymentData - Payment data including amount, currency, and description
 * @returns {Object} PayPal payment object
 */
const createPayPalPayment = async (paymentData) => {
  try {
    const payment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: paymentData.returnUrl,
        cancel_url: paymentData.cancelUrl
      },
      transactions: [{
        item_list: {
          items: paymentData.items
        },
        amount: {
          currency: paymentData.currency || 'USD',
          total: paymentData.totalAmount
        },
        description: paymentData.description
      }]
    };
    
    return new Promise((resolve, reject) => {
      paypal.payment.create(payment, (error, payment) => {
        if (error) {
          logger.error('Error creating PayPal payment:', error);
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });
  } catch (error) {
    logger.error('Error creating PayPal payment:', error);
    throw error;
  }
};

/**
 * Execute a PayPal payment
 * @param {String} paymentId - PayPal payment ID
 * @param {String} payerId - PayPal payer ID
 * @returns {Object} Executed PayPal payment
 */
const executePayPalPayment = async (paymentId, payerId) => {
  try {
    const execute_payment_json = {
      payer_id: payerId
    };
    
    return new Promise((resolve, reject) => {
      paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if (error) {
          logger.error('Error executing PayPal payment:', error);
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });
  } catch (error) {
    logger.error('Error executing PayPal payment:', error);
    throw error;
  }
};

/**
 * Capture all pre-order payments for a successful project
 * This function is called when a crowdfunding project reaches its funding goal
 * It captures all authorized Stripe payment intents for the project
 * @param {String} productId - The ID of the product concept
 * @returns {Number} Number of successfully captured payments
 * @throws {Error} If there's an error during payment capture
 */
const captureAllPreOrderPayments = async (productId) => {
  try {
    // Find all authorized pre-orders for this product
    const preOrders = await PreOrder.find({
      productConcept: productId,
      status: 'Authorized'
    });
    
    // Capture each payment
    let capturedCount = 0;
    for (const preOrder of preOrders) {
      try {
        // Capture the payment intent with Stripe
        await stripe.paymentIntents.capture(preOrder.stripePaymentIntentId);
        
        // Update pre-order status
        preOrder.status = 'Paid';
        await preOrder.save();
        capturedCount++;
      } catch (error) {
        logger.error(`Failed to capture payment for pre-order ${preOrder._id}:`, error);
        // In a real implementation, you might want to handle failed captures differently
      }
    }
    
    logger.info(`Captured payments for ${capturedCount}/${preOrders.length} pre-orders for product ${productId}`);
    return capturedCount;
  } catch (error) {
    logger.error('Error capturing pre-order payments:', error);
    throw error;
  }
};

/**
 * Cancel all pre-order payments for a failed project
 * This function is called when a crowdfunding project fails to reach its funding goal
 * It cancels all authorized Stripe payment intents for the project
 * @param {String} productId - The ID of the product concept
 * @returns {Number} Number of successfully cancelled payments
 * @throws {Error} If there's an error during payment cancellation
 */
const cancelAllPreOrderPayments = async (productId) => {
  try {
    // Find all authorized pre-orders for this product
    const preOrders = await PreOrder.find({
      productConcept: productId,
      status: 'Authorized'
    });
    
    // Cancel each payment
    let cancelledCount = 0;
    for (const preOrder of preOrders) {
      try {
        // Cancel the payment intent with Stripe
        await stripe.paymentIntents.cancel(preOrder.stripePaymentIntentId);
        
        // Update pre-order status
        preOrder.status = 'Cancelled';
        await preOrder.save();
        
        // Update product funding count
        const product = await ProductConcept.findById(productId);
        if (product) {
          product.currentFunding -= preOrder.quantity;
          await product.save();
        }
        cancelledCount++;
      } catch (error) {
        logger.error(`Failed to cancel payment for pre-order ${preOrder._id}:`, error);
        // In a real implementation, you might want to handle failed cancellations differently
      }
    }
    
    logger.info(`Cancelled payments for ${cancelledCount}/${preOrders.length} pre-orders for product ${productId}`);
    return cancelledCount;
  } catch (error) {
    logger.error('Error cancelling pre-order payments:', error);
    throw error;
  }
};

/**
 * Refund a pre-order payment
 * This function creates a refund for a specific pre-order payment
 * @param {String} preOrderId - The ID of the pre-order
 * @returns {Object} Stripe refund object
 * @throws {Error} If there's an error during refund creation
 */
const refundPreOrderPayment = async (preOrderId) => {
  try {
    const preOrder = await PreOrder.findById(preOrderId);
    if (!preOrder) {
      throw new Error('Pre-order not found');
    }
    
    // Create a refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: preOrder.stripePaymentIntentId,
    });
    
    // Update pre-order status
    preOrder.status = 'Refunded';
    await preOrder.save();
    
    return refund;
  } catch (error) {
    logger.error(`Failed to refund payment for pre-order ${preOrderId}:`, error);
    throw error;
  }
};

/**
 * Refund an order payment
 * This function creates a refund for a specific order payment
 * @param {String} orderId - The ID of the order
 * @returns {Object} Stripe refund object
 * @throws {Error} If there's an error during refund creation
 */
const refundOrderPayment = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Create a refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.stripePaymentIntentId,
    });
    
    // Update order status
    order.paymentStatus = 'Refunded';
    order.orderStatus = 'Cancelled';
    await order.save();
    
    return refund;
  } catch (error) {
    logger.error(`Failed to refund payment for order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Process a payment based on the payment method
 * @param {Object} paymentData - Payment data including method, amount, and other details
 * @returns {Object} Payment result
 */
const processPayment = async (paymentData) => {
  try {
    switch (paymentData.method) {
      case 'stripe':
        return await createStripePaymentIntent(paymentData);
      case 'paypal':
        return await createPayPalPayment(paymentData);
      case 'cod':
        // For Cash on Delivery, we don't process payment immediately
        return { status: 'cod_pending' };
      default:
        throw new Error('Unsupported payment method');
    }
  } catch (error) {
    logger.error(`Error processing ${paymentData.method} payment:`, error);
    throw error;
  }
};

module.exports = {
  createStripePaymentIntent,
  createPayPalPayment,
  executePayPalPayment,
  captureAllPreOrderPayments,
  cancelAllPreOrderPayments,
  refundPreOrderPayment,
  refundOrderPayment,
  processPayment
};