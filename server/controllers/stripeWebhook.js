const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const PreOrder = require('../models/PreOrder');
const { captureAllPreOrderPayments } = require('../services/paymentService');
const logger = require('../utils/logger');

// Handle Stripe webhook events
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      logger.info('PaymentIntent was successful!', paymentIntentSucceeded.id);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntentSucceeded);
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object;
      logger.warn('PaymentIntent failed!', paymentIntentFailed.id);
      // Then define and call a method to handle the failed payment intent.
      // handlePaymentIntentFailed(paymentIntentFailed);
      break;
    case 'charge.succeeded':
      const chargeSucceeded = event.data.object;
      logger.info('Charge succeeded!', chargeSucceeded.id);
      // Handle successful charge
      break;
    case 'charge.failed':
      const chargeFailed = event.data.object;
      logger.warn('Charge failed!', chargeFailed.id);
      // Handle failed charge
      break;
    default:
      logger.info(`Unhandled event type ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};

module.exports = {
  handleStripeWebhook
};