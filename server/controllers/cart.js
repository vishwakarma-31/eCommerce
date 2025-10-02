const User = require('../models/User');
const ProductConcept = require('../models/ProductConcept');
const { protect, isBacker } = require('../middleware/auth');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Check if product exists and is available for purchase
    const product = await ProductConcept.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.status !== 'Marketplace') {
      return res.status(400).json({ message: 'Product is not available for purchase' });
    }
    
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    // Add to cart
    const user = await User.findById(req.user._id);
    
    // Check if product is already in cart
    const existingItemIndex = user.cart.findIndex(item => 
      item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      user.cart.push({ product: productId, quantity });
    }
    
    await user.save();
    
    // Populate product details
    await user.populate('cart.product');
    
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }
    
    // Check if product exists and is available for purchase
    const product = await ProductConcept.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.status !== 'Marketplace') {
      return res.status(400).json({ message: 'Product is not available for purchase' });
    }
    
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    // Update cart item
    const user = await User.findById(req.user._id);
    
    const itemIndex = user.cart.findIndex(item => 
      item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    user.cart[itemIndex].quantity = quantity;
    await user.save();
    
    // Populate product details
    await user.populate('cart.product');
    
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    user.cart = user.cart.filter(item => 
      item.product.toString() !== productId
    );
    
    await user.save();
    
    // Populate product details
    await user.populate('cart.product');
    
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};