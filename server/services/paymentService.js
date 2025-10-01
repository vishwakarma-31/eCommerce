const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PreOrder = require('../models/PreOrder');
const ProductConcept = require('../models/ProductConcept');

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
        console.error(`Failed to capture payment for pre-order ${preOrder._id}:`, error);
        // In a real implementation, you might want to handle failed captures differently
      }
    }
    
    console.log(`Captured payments for ${capturedCount}/${preOrders.length} pre-orders for product ${productId}`);
    return capturedCount;
  } catch (error) {
    console.error('Error capturing pre-order payments:', error);
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
        console.error(`Failed to cancel payment for pre-order ${preOrder._id}:`, error);
        // In a real implementation, you might want to handle failed cancellations differently
      }
    }
    
    console.log(`Cancelled payments for ${cancelledCount}/${preOrders.length} pre-orders for product ${productId}`);
    return cancelledCount;
  } catch (error) {
    console.error('Error cancelling pre-order payments:', error);
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
    console.error(`Failed to refund payment for pre-order ${preOrderId}:`, error);
    throw error;
  }
};

module.exports = {
  captureAllPreOrderPayments,
  cancelAllPreOrderPayments,
  refundPreOrderPayment
};