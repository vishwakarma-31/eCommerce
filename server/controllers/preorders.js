const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PreOrder = require('../models/PreOrder');
const ProductConcept = require('../models/ProductConcept');
const { protect, isBacker } = require('../middleware/auth');

// Create Stripe payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { productConceptId, quantity } = req.body;
    
    // Validate product exists and is in funding status
    const product = await ProductConcept.findById(productConceptId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.status !== 'Funding') {
      return res.status(400).json({ message: 'Product is not in funding stage' });
    }
    
    // Calculate total amount (in cents for Stripe)
    const totalAmount = Math.round(product.price * quantity * 100);
    
    // Create a Stripe payment intent with manual capture
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      capture_method: 'manual', // For pre-orders, we capture manually after funding success
      metadata: {
        productConceptId: productConceptId,
        userId: req.user._id.toString(),
        quantity: quantity.toString()
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

// Create new pre-order
const createPreOrder = async (req, res) => {
  try {
    const { productConceptId, quantity, stripePaymentIntentId, shippingAddress } = req.body;
    
    // Validate product exists and is in funding status
    const product = await ProductConcept.findById(productConceptId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.status !== 'Funding') {
      return res.status(400).json({ message: 'Product is not in funding stage' });
    }
    
    // Verify the payment intent belongs to this user and product
    const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentIntentId);
    if (paymentIntent.metadata.productConceptId !== productConceptId ||
        paymentIntent.metadata.userId !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Invalid payment intent' });
    }
    
    // Calculate total amount
    const totalAmount = product.price * quantity;
    
    // Create pre-order
    const preOrder = new PreOrder({
      backer: req.user._id,
      productConcept: productConceptId,
      quantity,
      totalPrice: totalAmount,
      stripePaymentIntentId,
      status: 'Authorized', // Set initial status to Authorized
      shippingAddress
    });
    
    const savedPreOrder = await preOrder.save();
    
    // Update product funding count
    product.currentFunding += quantity;
    await product.save();
    
    res.status(201).json(savedPreOrder);
  } catch (error) {
    console.error('Error creating pre-order:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get user's pre-orders
const getMyPreOrders = async (req, res) => {
  try {
    const preOrders = await PreOrder.find({ backer: req.user._id })
      .populate('productConcept')
      .sort({ createdAt: -1 });
    res.status(200).json(preOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single pre-order details
const getPreOrderById = async (req, res) => {
  try {
    const preOrder = await PreOrder.findById(req.params.id)
      .populate('productConcept')
      .populate('backer', 'name email');
    
    if (!preOrder) {
      return res.status(404).json({ message: 'Pre-order not found' });
    }
    
    // Check if user is authorized to view this pre-order
    if (preOrder.backer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to view this pre-order' });
    }
    
    res.status(200).json(preOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel pre-order
const cancelPreOrder = async (req, res) => {
  try {
    const preOrder = await PreOrder.findById(req.params.id);
    
    if (!preOrder) {
      return res.status(404).json({ message: 'Pre-order not found' });
    }
    
    // Check if user is authorized to cancel this pre-order
    if (preOrder.backer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this pre-order' });
    }
    
    // Check if pre-order can be cancelled (must be in Authorized status)
    if (preOrder.status !== 'Authorized') {
      return res.status(400).json({ message: 'Pre-order cannot be cancelled' });
    }
    
    // Cancel the payment intent with Stripe
    await stripe.paymentIntents.cancel(preOrder.stripePaymentIntentId);
    
    // Update pre-order status
    preOrder.status = 'Cancelled';
    await preOrder.save();
    
    // Update product funding count
    const product = await ProductConcept.findById(preOrder.productConcept);
    if (product) {
      product.currentFunding -= preOrder.quantity;
      await product.save();
    }
    
    res.status(200).json({ message: 'Pre-order cancelled successfully', preOrder });
  } catch (error) {
    console.error('Error cancelling pre-order:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  createPreOrder,
  getMyPreOrders,
  getPreOrderById,
  cancelPreOrder
};