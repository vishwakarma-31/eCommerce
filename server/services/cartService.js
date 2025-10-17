const Cart = require('../models/Cart');
const User = require('../models/User');
const ProductConcept = require('../models/ProductConcept');

/**
 * Get or create cart for user
 * @param {String} userId - User ID
 * @returns {Object} Cart document
 */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  
  if (!cart) {
    // Create new cart if doesn't exist
    cart = new Cart({
      user: userId,
      items: [],
      totalPrice: 0,
      totalItems: 0
    });
    await cart.save();
    
    // Update user with cart reference
    await User.findByIdAndUpdate(userId, { cart: cart._id });
  }
  
  return cart;
};

/**
 * Get user's cart
 * @param {String} userId - User ID
 * @returns {Object} Populated cart
 */
const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return cart;
};

/**
 * Add item to cart
 * @param {String} userId - User ID
 * @param {String} productId - Product ID
 * @param {Object} variant - Product variant {size, color}
 * @param {Number} quantity - Quantity to add
 * @returns {Object} Updated cart
 */
const addItemToCart = async (userId, productId, variant, quantity) => {
  // Validate product
  const product = await ProductConcept.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  
  if (product.status !== 'Marketplace') {
    throw new Error('Product is not available for purchase');
  }
  
  // Check stock
  if (product.stockQuantity < quantity) {
    throw new Error('Insufficient stock');
  }
  
  // Get or create cart
  let cart = await getOrCreateCart(userId);
  
  // Add item to cart
  cart.addItem(productId, variant, quantity, product.price);
  await cart.save();
  
  // Populate product details
  await cart.populate('items.product');
  
  return cart;
};

/**
 * Update item quantity in cart
 * @param {String} userId - User ID
 * @param {String} itemId - Cart item ID
 * @param {Number} quantity - New quantity
 * @returns {Object} Updated cart
 */
const updateCartItemQuantity = async (userId, itemId, quantity) => {
  const cart = await getOrCreateCart(userId);
  
  // Update item quantity
  cart.updateItemQuantity(itemId, quantity);
  await cart.save();
  
  // Populate product details
  await cart.populate('items.product');
  
  return cart;
};

/**
 * Remove item from cart
 * @param {String} userId - User ID
 * @param {String} itemId - Cart item ID
 * @returns {Object} Updated cart
 */
const removeItemFromCart = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);
  
  // Remove item from cart
  cart.removeItem(itemId);
  await cart.save();
  
  // Populate product details
  await cart.populate('items.product');
  
  return cart;
};

/**
 * Clear entire cart
 * @param {String} userId - User ID
 * @returns {Object} Cleared cart
 */
const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  
  // Clear cart
  cart.clearCart();
  await cart.save();
  
  return cart;
};

/**
 * Apply coupon to cart
 * @param {String} userId - User ID
 * @param {String} couponCode - Coupon code
 * @returns {Object} Updated cart with discount applied
 */
const applyCoupon = async (userId, couponCode) => {
  // For now, we'll implement a simple coupon system
  // In a real application, this would connect to a coupon service
  const cart = await getOrCreateCart(userId);
  
  // Simple coupon validation (in a real app, this would check against a database)
  let discount = 0;
  if (couponCode === 'WELCOME10') {
    discount = 0.1; // 10% discount
  } else if (couponCode === 'SAVE20') {
    discount = 0.2; // 20% discount
  }
  
  if (discount > 0) {
    // Apply discount to cart
    cart.discount = discount;
    cart.totalPrice = cart.totalPrice * (1 - discount);
    await cart.save();
  } else {
    throw new Error('Invalid coupon code');
  }
  
  // Populate product details
  await cart.populate('items.product');
  
  return cart;
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
  applyCoupon,
  getOrCreateCart
};