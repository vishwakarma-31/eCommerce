const mongoose = require('mongoose');

const productConceptSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  detailedDescription: {
    type: String
  },
  images: [{
    type: String,
    required: true
  }],
  price: {
    type: Number,
    required: true
  },
  
  // Crowdfunding specific fields
  fundingGoal: {
    type: Number,
    required: true
  }, // Target number of pre-orders
  currentFunding: {
    type: Number,
    default: 0
  }, // Current number of pre-orders
  deadline: {
    type: Date,
    required: true
  },
  
  // Marketplace specific fields (post-funding)
  stockQuantity: {
    type: Number,
    default: 0
  },
  soldQuantity: {
    type: Number,
    default: 0
  },
  
  status: {
    type: String,
    enum: ['Funding', 'Successful', 'Failed', 'InProduction', 'Marketplace', 'OutOfStock', 'Discontinued'],
    default: 'Funding'
  },
  
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Reviews and ratings
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  
  isApproved: {
    type: Boolean,
    default: false
  }, // Admin approval
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Critical Indexes for Performance
productConceptSchema.index({ creator: 1 }); // Index for querying by creator
productConceptSchema.index({ category: 1 }); // Index for category-based queries
productConceptSchema.index({ status: 1 }); // Index for status-based queries
productConceptSchema.index({ slug: 1 }, { unique: true }); // Unique index for slug lookups
productConceptSchema.index({ deadline: 1 }); // Index for deadline-based queries (cron jobs)
productConceptSchema.index({ createdAt: -1 }); // Index for sorting by creation date
productConceptSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Text search index

module.exports = mongoose.model('ProductConcept', productConceptSchema);