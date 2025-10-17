const User = require('../models/User');
const ProductConcept = require('../models/ProductConcept');
const { protect, isAdmin, isBacker } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Get public user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name profileImage bio role createdAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update own profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'bio', 'phone'];
    allowedUpdates.forEach(update => {
      if (req.body[update] !== undefined) {
        user[update] = req.body[update];
      }
    });

    // Update email preferences if provided
    if (req.body.emailPreferences) {
      user.emailPreferences = {
        ...user.emailPreferences,
        ...req.body.emailPreferences
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImage: updatedUser.profileImage,
      bio: updatedUser.bio,
      phone: updatedUser.phone,
      emailPreferences: updatedUser.emailPreferences,
      addresses: updatedUser.addresses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add address
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const newAddress = {
      ...req.body,
      _id: undefined // Let MongoDB generate the ID
    };
    
    // If this is the first address or marked as default, set it as default
    if (user.addresses.length === 0 || req.body.isDefault) {
      newAddress.isDefault = true;
      // Unset default on other addresses
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    user.addresses.push(newAddress);
    await user.save();
    
    res.status(201).json({
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // If marked as default, unset default on other addresses
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // Update the address
    Object.assign(user.addresses[addressIndex], req.body);
    
    await user.save();
    
    res.json({
      message: 'Address updated successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Remove the address
    user.addresses.splice(addressIndex, 1);
    
    // If the deleted address was default and there are other addresses, set the first one as default
    if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
      user.addresses[0].isDefault = true;
    }
    
    await user.save();
    
    res.json({
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set default address
const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Unset default on all addresses
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
    
    // Set the selected address as default
    user.addresses[addressIndex].isDefault = true;
    
    await user.save();
    
    res.json({
      message: 'Default address updated successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update email preferences
const updateEmailPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.emailPreferences = {
      ...user.emailPreferences,
      ...req.body
    };
    
    await user.save();
    
    res.json({
      message: 'Email preferences updated successfully',
      emailPreferences: user.emailPreferences
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Validate input
    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }
    
    // Delete the user
    await user.remove();
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get recently viewed products
const getRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('recentlyViewed.product');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Sort by viewedAt descending (most recent first)
    const recentlyViewed = user.recentlyViewed
      .sort((a, b) => b.viewedAt - a.viewedAt)
      .map(item => item.product)
      .filter(product => product !== null); // Remove null products
    
    res.json(recentlyViewed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add product to recently viewed
const addRecentlyViewed = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if product exists
    const product = await ProductConcept.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Remove the product if it's already in the recently viewed list
    user.recentlyViewed = user.recentlyViewed.filter(
      item => item.product.toString() !== productId
    );
    
    // Add the product to the beginning of the list
    user.recentlyViewed.unshift({
      product: productId,
      viewedAt: Date.now()
    });
    
    // Limit to 20 most recent items
    if (user.recentlyViewed.length > 20) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 20);
    }
    
    await user.save();
    
    res.json({ message: 'Product added to recently viewed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear recently viewed history
const clearRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.recentlyViewed = [];
    await user.save();
    
    res.json({ message: 'Recently viewed history cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return file information
    res.status(200).json({ 
      message: 'Profile image uploaded successfully', 
      image: {
        original: req.file.path,
        thumbnail: req.file.thumbnail || null,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
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

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
    await user.save();
    
    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Move wishlist item to cart
const moveWishlistItemToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id).populate('cart');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if product exists
    const product = await ProductConcept.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product is in wishlist
    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product not in wishlist' });
    }
    
    // Add to cart (this would need to be implemented based on your cart system)
    // For now, we'll just simulate adding to cart
    
    // Remove from wishlist
    user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
    await user.save();
    
    res.json({ 
      message: 'Product moved from wishlist to cart',
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Share wishlist
const shareWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // In a real implementation, you would:
    // 1. Generate a shareable link
    // 2. Send email/social media share
    // 3. Create a public wishlist view
    
    // For now, we'll just return the wishlist data
    res.json({ 
      message: 'Wishlist shared successfully',
      wishlist: user.wishlist,
      shareLink: `${process.env.CLIENT_URL}/wishlist/${user._id}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get price drop notifications for wishlist items
const getPriceDropNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // In a real implementation, you would:
    // 1. Check for price drops on wishlist items
    // 2. Send notifications
    // 3. Return price drop information
    
    // For now, we'll just return an empty array
    res.json({ 
      message: 'Price drop notifications retrieved',
      priceDrops: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get personalized recommendations
const getRecommendations = async (req, res) => {
  try {
    // In a real implementation, we would use more sophisticated logic
    // For now, we'll just return some random products
    const products = await ProductConcept.find({ status: 'Marketplace' }).limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await User.find({})
      .select('-password')
      .skip(skip)
      .limit(limit);
      
    const total = await User.countDocuments();
    
    res.json({
      users,
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

// Get user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.remove();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Suspend user (admin only)
const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.isActive = false;
      const updatedUser = await user.save();
      res.json({ message: 'User suspended', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveWishlistItemToCart,
  shareWishlist,
  getPriceDropNotifications,
  getRecommendations,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  suspendUser,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  updateEmailPreferences,
  deleteAccount,
  getRecentlyViewed,
  addRecentlyViewed,
  clearRecentlyViewed
};