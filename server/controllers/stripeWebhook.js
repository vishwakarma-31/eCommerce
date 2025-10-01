const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PreOrder = require('../models/PreOrder');
const Order = require('../models/Order');
const ProductConcept = require('../models/ProductConcept');

/**
 * Handle Stripe webhook events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntentSucceeded.id);
      
      // Check if this is for a pre-order (crowdfunding) or regular order (marketplace)
      if (paymentIntentSucceeded.metadata.productConceptId) {
        // This is a pre-order payment
        const preOrder = await PreOrder.findOne({ stripePaymentIntentId: paymentIntentSucceeded.id });
        if (preOrder) {
          // Only update status if it's still in Authorized state
          if (preOrder.status === 'Authorized') {
            preOrder.status = 'Paid';
            await preOrder.save();
          }
        }
      } else {
        // This is a marketplace order payment
        const order = await Order.findOne({ stripePaymentIntentId: paymentIntentSucceeded.id });
        if (order) {
          // Update order status to Processing
          order.paymentStatus = 'Completed';
          order.orderStatus = 'Processing';
          await order.save();
        }
      }
      break;
      
    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object;
      console.log('PaymentIntent failed!', paymentIntentFailed.id);
      
      // Handle failed payment for both pre-orders and orders
      if (paymentIntentFailed.metadata.productConceptId) {
        // This is a pre-order payment
        const preOrder = await PreOrder.findOne({ stripePaymentIntentId: paymentIntentFailed.id });
        if (preOrder) {
          preOrder.status = 'Failed';
          await preOrder.save();
          
          // Update product funding count
          const product = await ProductConcept.findById(paymentIntentFailed.metadata.productConceptId);
          if (product) {
            product.currentFunding -= parseInt(paymentIntentFailed.metadata.quantity);
            await product.save();
          }
        }
      } else {
        // This is a marketplace order payment
        const order = await Order.findOne({ stripePaymentIntentId: paymentIntentFailed.id });
        if (order) {
          order.paymentStatus = 'Failed';
          await order.save();
        }
      }
      break;
      
    case 'charge.refunded':
      const chargeRefunded = event.data.object;
      console.log('Charge was refunded!', chargeRefunded.id);
      
      // Handle refund for both pre-orders and orders
      if (chargeRefunded.payment_intent) {
        // Check if this is for a pre-order
        const preOrder = await PreOrder.findOne({ stripePaymentIntentId: chargeRefunded.payment_intent });
        if (preOrder) {
          preOrder.status = 'Refunded';
          await preOrder.save();
        }
        
        // Check if this is for a marketplace order
        const order = await Order.findOne({ stripePaymentIntentId: chargeRefunded.payment_intent });
        if (order) {
          order.paymentStatus = 'Refunded';
          await order.save();
        }
      }
      break;
      
    case 'payment_intent.canceled':
      const paymentIntentCanceled = event.data.object;
      console.log('PaymentIntent was canceled!', paymentIntentCanceled.id);
      
      // Handle cancellation for pre-orders
      if (paymentIntentCanceled.metadata.productConceptId) {
        const preOrder = await PreOrder.findOne({ stripePaymentIntentId: paymentIntentCanceled.id });
        if (preOrder) {
          preOrder.status = 'Cancelled';
          await preOrder.save();
          
          // Update product funding count
          const product = await ProductConcept.findById(paymentIntentCanceled.metadata.productConceptId);
          if (product) {
            product.currentFunding -= parseInt(paymentIntentCanceled.metadata.quantity);
            await product.save();
          }
        }
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};

module.exports = {
  handleStripeWebhook
};