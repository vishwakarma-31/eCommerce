const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const ProductConcept = require('../models/ProductConcept');
const User = require('../models/User');
const { protect, isBacker } = require('../middleware/auth');
const { sendOrderConfirmationEmail } = require('../services/emailService');
const { processPayment, refundOrderPayment } = require('../services/paymentService');
const PDFDocument = require('pdfkit');
const logger = require('../utils/logger');

// Create payment for marketplace order
const createPayment = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    
    // Calculate total amount
    let totalAmount = 0;
    
    // Validate items and calculate total
    for (const item of items) {
      const product = await ProductConcept.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product} not found` });
      }
      
      if (product.status !== 'Marketplace') {
        return res.status(400).json({ message: `Product ${product.title} is not available for purchase` });
      }
      
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
      }
      
      totalAmount += product.price * item.quantity;
    }
    
    // Process payment based on selected method
    let paymentResult;
    
    switch (paymentMethod) {
      case 'card':
        // Create a Stripe payment intent with automatic capture for marketplace orders
        paymentResult = await stripe.paymentIntents.create({
          amount: Math.round(totalAmount * 100), // Convert to cents
          currency: 'usd',
          capture_method: 'automatic', // Capture immediately for marketplace orders
          metadata: {
            userId: req.user._id.toString()
          }
        });
        break;
        
      case 'paypal':
        // For PayPal, we'll return a URL for redirect
        // In a real implementation, you would create a PayPal payment and return the approval URL
        return res.status(200).json({
          paymentMethod: 'paypal',
          message: 'Redirect to PayPal for payment'
        });
        
      case 'cod':
        // For Cash on Delivery, no payment processing is needed at this stage
        return res.status(200).json({
          paymentMethod: 'cod',
          message: 'Order will be processed with Cash on Delivery'
        });
        
      default:
        return res.status(400).json({ message: 'Invalid payment method' });
    }
    
    res.status(200).json({
      clientSecret: paymentResult.client_secret,
      paymentMethod: 'card'
    });
  } catch (error) {
    logger.error('Error creating payment intent:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, stripePaymentIntentId, paypalPaymentId, shippingAddress } = req.body;
    
    // Calculate total amount
    let totalAmount = 0;
    
    // Validate items and calculate total
    for (const item of items) {
      const product = await ProductConcept.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product} not found` });
      }
      
      if (product.status !== 'Marketplace') {
        return res.status(400).json({ message: `Product ${product.title} is not available for purchase` });
      }
      
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
      }
      
      item.price = product.price;
      totalAmount += product.price * item.quantity;
    }
    
    // Verify payment based on payment method
    if (paymentMethod === 'card' && stripePaymentIntentId) {
      // Verify the payment intent belongs to this user
      const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentIntentId);
      if (paymentIntent.metadata.userId !== req.user._id.toString() || 
          paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: 'Invalid or unsuccessful payment intent' });
      }
    } else if (paymentMethod === 'paypal' && paypalPaymentId) {
      // In a real implementation, you would verify the PayPal payment
      // For now, we'll assume it's valid
    } else if (paymentMethod !== 'cod') {
      return res.status(400).json({ message: 'Invalid payment method or missing payment ID' });
    }
    
    // Create order
    const order = new Order({
      buyer: req.user._id,
      items,
      totalAmount,
      paymentMethod,
      stripePaymentIntentId: paymentMethod === 'card' ? stripePaymentIntentId : undefined,
      paypalPaymentId: paymentMethod === 'paypal' ? paypalPaymentId : undefined,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Completed', // Set initial payment status
      orderStatus: 'Processing', // Set initial order status
      shippingAddress
    });
    
    const savedOrder = await order.save();
    
    // Update product stock
    for (const item of items) {
      await ProductConcept.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity, soldQuantity: item.quantity }
      });
    }
    
    // Send order confirmation email
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        await sendOrderConfirmationEmail(savedOrder, user);
      }
    } catch (emailError) {
      logger.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email sending fails
    }
    
    res.status(201).json(savedOrder);
  } catch (error) {
    logger.error('Error creating order:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get user's orders
const getMyOrders = async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ buyer: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Order.countDocuments({ buyer: req.user._id });
    
    res.status(200).json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order details
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('buyer', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (order.buyer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to cancel this order
    if (order.buyer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }
    
    // Check if order can be cancelled (must be in Processing status)
    if (order.orderStatus !== 'Processing') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }
    
    // If payment was made via Stripe, refund the payment
    if (order.paymentMethod === 'card' && order.stripePaymentIntentId) {
      try {
        await refundOrderPayment(order._id);
      } catch (refundError) {
        logger.error('Error refunding payment:', refundError);
        return res.status(500).json({ message: 'Error processing refund' });
      }
    }
    
    // Update order status
    order.orderStatus = 'Cancelled';
    await order.save();
    
    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    logger.error('Error cancelling order:', error);
    res.status(500).json({ message: error.message });
  }
};

// Track order
const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to track this order
    if (order.buyer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to track this order' });
    }
    
    // Return order tracking information
    res.status(200).json({
      orderId: order._id,
      orderStatus: order.orderStatus,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      deliveredAt: order.deliveredAt,
      statusHistory: order.statusHistory || [] // If we implement status history tracking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download invoice PDF
const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('buyer', 'name email address');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to download this invoice
    if (order.buyer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to download this invoice' });
    }
    
    // Create PDF document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Add invoice content
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.moveDown();
    
    doc.text(`Bill To: ${order.buyer.name}`);
    doc.text(`Email: ${order.buyer.email}`);
    doc.moveDown();
    
    // Items table
    doc.text('Items:');
    doc.moveDown();
    
    let total = 0;
    order.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      doc.text(`${item.product.title} - Qty: ${item.quantity} - $${item.price.toFixed(2)} - $${itemTotal.toFixed(2)}`);
    });
    
    doc.moveDown();
    doc.text(`Total: $${total.toFixed(2)}`);
    
    // Finalize the PDF
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request return/refund
const requestReturn = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to request return for this order
    if (order.buyer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to request return for this order' });
    }
    
    // Check if order can be returned (must be delivered)
    if (order.orderStatus !== 'Delivered') {
      return res.status(400).json({ message: 'Order must be delivered to request return' });
    }
    
    // Update order for return request
    order.returnRequested = true;
    order.returnReason = reason;
    order.returnRequestedAt = Date.now();
    
    // In a real implementation, you would also:
    // 1. Send notification to admin
    // 2. Update order status to "Return Requested"
    // 3. Handle refund process
    
    await order.save();
    
    res.status(200).json({ message: 'Return request submitted successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders with filters
const getOrdersWithFilters = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { buyer: req.user._id };
    
    // Add status filter
    if (status) {
      filter.orderStatus = status;
    }
    
    // Add date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }
    
    const orders = await Order.find(filter)
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Order.countDocuments(filter);
    
    res.status(200).json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  trackOrder,
  downloadInvoice,
  requestReturn,
  getOrdersWithFilters
};