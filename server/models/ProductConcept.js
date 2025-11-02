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
  shortDescription: {
    type: String,
    maxlength: 200
  },
  images: [{
    type: String,
    required: true
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // Product categorization
  category: {
    type: String,
    required: true,
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  
  // Product variants
  variants: [{
    size: String,
    color: String,
    material: String,
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    price: {
      type: Number,
      min: 0
    },
    discountPrice: {
      type: Number,
      min: 0
    },
    sku: String,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Stock management
  totalStock: {
    type: Number,
    default: 0,
    min: 0
  },
  stockStatus: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  
  // Ratings and reviews
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
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  
  // Product flags
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  isFreeShipping: {
    type: Boolean,
    default: false
  },
  
  // Tags and specifications
  tags: [{
    type: String,
    trim: true
  }],
  specifications: [{
    key: String,
    value: String
  }],
  
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
  soldQuantity: {
    type: Number,
    default: 0
  },
  
  status: {
    type: String,
    enum: ['Funding', 'Successful', 'Failed', 'InProduction', 'Marketplace', 'OutOfStock', 'Discontinued', 'Active', 'Inactive', 'Draft'],
    default: 'Funding'
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
  sales: {
    type: Number,
    default: 0
  },
  popularityScore: {
    type: Number,
    default: 0
  },
  
  // Q&A
  questions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    question: {
      type: String,
      required: true,
      trim: true
    },
    answers: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      answer: {
        type: String,
        required: true,
        trim: true
      },
      isAdmin: {
        type: Boolean,
        default: false
      },
      upvotes: {
        type: Number,
        default: 0
      },
      upvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    upvotes: {
      type: Number,
      default: 0
    },
    upvotedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isAnswered: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Virtual for calculating final price (considering discount)
productConceptSchema.virtual('finalPrice').get(function() {
  return this.discountPrice && this.discountPrice < this.price ? this.discountPrice : this.price;
});

// Virtual for checking if product is on sale
productConceptSchema.virtual('isOnSaleComputed').get(function() {
  return this.discountPrice && this.discountPrice < this.price;
});

// Ensure virtual fields are serialized
productConceptSchema.set('toJSON', {
  virtuals: true
});

// Critical Indexes for Performance
productConceptSchema.index({ creator: 1 }); // Index for querying by creator
productConceptSchema.index({ category: 1 }); // Index for category-based queries
productConceptSchema.index({ subcategory: 1 }); // Index for subcategory-based queries
productConceptSchema.index({ brand: 1 }); // Index for brand-based queries
productConceptSchema.index({ status: 1 }); // Index for status-based queries
// Unique index for slug lookups is already defined with unique: true in schema definition
productConceptSchema.index({ deadline: 1 }); // Index for deadline-based queries (cron jobs)
productConceptSchema.index({ createdAt: -1 }); // Index for sorting by creation date
productConceptSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Text search index
productConceptSchema.index({ isFeatured: 1 }); // Index for featured products
productConceptSchema.index({ isNewArrival: 1 }); // Index for new arrivals
productConceptSchema.index({ isBestSeller: 1 }); // Index for best sellers
productConceptSchema.index({ averageRating: -1 }); // Index for rating-based queries
productConceptSchema.index({ sales: -1 }); // Index for best sellers based on sales
productConceptSchema.index({ price: 1 }); // Index for price-based queries
productConceptSchema.index({ stockStatus: 1 }); // Index for availability queries
productConceptSchema.index({ isOnSale: 1 }); // Index for sale items
productConceptSchema.index({ isFreeShipping: 1 }); // Index for free shipping items
productConceptSchema.index({ 'variants.color': 1 }); // Index for color variants
productConceptSchema.index({ 'variants.size': 1 }); // Index for size variants
productConceptSchema.index({ 'variants.material': 1 }); // Index for material variants
productConceptSchema.index({ popularityScore: -1 }); // Index for popularity-based queries

// Additional indexes for performance optimization
productConceptSchema.index({ category: 1, price: 1 }); // Compound index for category and price queries
productConceptSchema.index({ ratings: -1 }); // Index for rating-based queries (alternative to averageRating)

module.exports = mongoose.model('ProductConcept', productConceptSchema);