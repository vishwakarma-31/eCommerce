const User = require('../models/User');
const ProductConcept = require('../models/ProductConcept');
const { protect, isBacker } = require('../middleware/auth');
const { 
  getCart, 
  addItemToCart, 
  updateCartItemQuantity, 
  removeItemFromCart, 
  clearCart, 
  applyCoupon 
} = require('../services/cartService');

// Get user's cart
const getCartController = async (req, res) => {
  try {
    const cart = await getCart(req.user._id);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
const addToCartController = async (req, res) => {
  try {
    const { productId, variant, quantity } = req.body;
    
    const cart = await addItemToCart(req.user._id, productId, variant, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update item quantity
const updateCartItemController = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    const cart = await updateCartItemQuantity(req.user._id, itemId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove item from cart
const removeFromCartController = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const cart = await removeItemFromCart(req.user._id, itemId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Clear entire cart
const clearCartController = async (req, res) => {
  try {
    const cart = await clearCart(req.user._id);
    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply coupon code
const applyCouponController = async (req, res) => {
  try {
    const { couponCode } = req.body;
    
    const cart = await applyCoupon(req.user._id, couponCode);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCart: getCartController,
  addToCart: addToCartController,
  updateCartItem: updateCartItemController,
  removeFromCart: removeFromCartController,
  clearCart: clearCartController,
  applyCoupon: applyCouponController
};