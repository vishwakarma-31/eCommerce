const User = require('../models/User');
const ProductConcept = require('../models/ProductConcept');
const { protect, isBacker } = require('../middleware/auth');

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Check if product exists
    const product = await ProductConcept.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Add to wishlist if not already there
    const user = await User.findById(req.user._id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    
    res.json({ message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
    await user.save();
    
    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};