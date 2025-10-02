const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductConcept',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  comment: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }], // Optional review images
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Critical Indexes for Performance
reviewSchema.index({ product: 1 }); // Index for querying reviews by product
reviewSchema.index({ author: 1 }); // Index for querying reviews by author

// Ensure a user can only review a product once
reviewSchema.index({ product: 1, author: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);