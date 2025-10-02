const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const ProductConcept = require('../models/ProductConcept');
const User = require('../models/User');
const { protect, isBacker } = require('../middleware/auth');
const { sendOrderConfirmationEmail } = require('../services/emailService');

// Create payment for marketplace order
const createPayment = async (req, res) => {
  try {
    const { items } = req.body;
    
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
    
    // Create a Stripe payment intent with automatic capture for marketplace orders
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      capture_method: 'automatic', // Capture immediately for marketplace orders
      metadata: {
        userId: req.user._id.toString()
      }
    });
    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, stripePaymentIntentId, shippingAddress } = req.body;
    
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
    
    // Verify the payment intent belongs to this user
    const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentIntentId);
    if (paymentIntent.metadata.userId !== req.user._id.toString() || 
        paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Invalid or unsuccessful payment intent' });
    }
    
    // Create order
    const order = new Order({
      buyer: req.user._id,
      items,
      totalAmount,
      paymentMethod,
      stripePaymentIntentId,
      paymentStatus: 'Completed', // Set initial payment status
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
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email sending fails
    }
    
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
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
    
    // Update order status
    order.orderStatus = 'Cancelled';
    await order.save();
    
    // In a real implementation, you would also handle refunding the payment
    // and restocking the items
    
    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
};