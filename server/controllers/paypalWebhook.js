const paypal = require('paypal-rest-sdk');
const Order = require('../models/Order');
const logger = require('../utils/logger');

// Handle PayPal webhook events
const handlePayPalWebhook = async (req, res) => {
  try {
    // Verify the webhook signature (simplified for this example)
    // In production, you should verify the webhook signature properly
    
    const event = req.body;
    const eventType = event.event_type;
    
    logger.info('PayPal webhook received:', eventType);
    
    switch (eventType) {
      case 'PAYMENT.SALE.COMPLETED':
        const paymentId = event.resource.parent_payment;
        logger.info('PayPal payment completed:', paymentId);
        
        // Update order status in database
        const order = await Order.findOne({ paypalPaymentId: paymentId });
        if (order) {
          order.paymentStatus = 'Completed';
          await order.save();
          logger.info('Order updated for PayPal payment:', order._id);
        }
        break;
        
      case 'PAYMENT.SALE.REFUNDED':
        const refundId = event.resource.id;
        logger.info('PayPal payment refunded:', refundId);
        
        // Update order status in database
        // In a real implementation, you would find the order by refund ID
        break;
        
      default:
        logger.info(`Unhandled PayPal event type: ${eventType}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Error handling PayPal webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  handlePayPalWebhook
};