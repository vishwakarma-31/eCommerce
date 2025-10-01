const Review = require('../models/Review');
const ProductConcept = require('../models/ProductConcept');
const User = require('../models/User');
const { protect, isBacker } = require('../middleware/auth');

// Get all reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('author', 'name profileImage')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a review
const createReview = async (req, res) => {
  try {
    const { rating, title, comment, product } = req.body;
    
    // Check if product exists
    const productDoc = await ProductConcept.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user has purchased or received this product
    const user = await User.findById(req.user._id);
    const hasPurchased = user.purchasedProducts.some(
      item => item.product.toString() === product
    );
    
    // Create review
    const review = new Review({
      author: req.user._id,
      product,
      rating,
      title,
      comment,
      isVerifiedPurchase: hasPurchased
    });
    
    const createdReview = await review.save();
    
    // Populate user info
    await createdReview.populate('author', 'name profileImage');
    
    res.status(201).json(createdReview);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns this review
    if (review.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    
    const updatedReview = await review.save();
    
    // Populate user info
    await updatedReview.populate('author', 'name profileImage');
    
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns this review or is admin
    if (review.author.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await review.remove();
    
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark review as helpful
const markAsHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Increment helpful count
    review.helpfulCount += 1;
    await review.save();
    
    res.json({ message: 'Review marked as helpful', helpfulCount: review.helpfulCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markAsHelpful
};