const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  // For tracking user search history
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous searches
  },
  query: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  // For tracking popular searches
  searchCount: {
    type: Number,
    default: 1
  },
  // Search metadata
  timestamp: {
    type: Date,
    default: Date.now
  },
  // Search results count
  resultsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
searchSchema.index({ query: 1 });
searchSchema.index({ user: 1 });
searchSchema.index({ searchCount: -1 });
searchSchema.index({ timestamp: -1 });

// Compound index for user search history
searchSchema.index({ user: 1, timestamp: -1 });

// Compound index for popular searches
searchSchema.index({ query: 1, searchCount: -1 });

// Pre-save middleware to update search count for popular searches
searchSchema.pre('save', async function(next) {
  // If this is a new search query (not from user history), increment the global count
  if (this.isNew && !this.user) {
    const existingSearch = await this.constructor.findOne({ query: this.query });
    if (existingSearch) {
      // If query already exists, increment count and update timestamp
      existingSearch.searchCount += 1;
      existingSearch.timestamp = new Date();
      await existingSearch.save();
      // Prevent saving this duplicate
      return next(new Error('Search query already exists'));
    }
  }
  next();
});

// Static method to record a search
searchSchema.statics.recordSearch = async function(query, userId = null, resultsCount = 0) {
  try {
    // Record user search history (if user is logged in)
    if (userId) {
      await this.create({
        user: userId,
        query: query,
        resultsCount: resultsCount
      });
    }
    
    // Update popular searches count
    const existingSearch = await this.findOne({ query: query, user: null });
    if (existingSearch) {
      // Update existing popular search
      existingSearch.searchCount += 1;
      existingSearch.resultsCount = resultsCount;
      existingSearch.timestamp = new Date();
      await existingSearch.save();
    } else {
      // Create new popular search entry
      await this.create({
        query: query,
        searchCount: 1,
        resultsCount: resultsCount
      });
    }
  } catch (error) {
    // Log error but don't fail the search
    console.error('Error recording search:', error);
  }
};

// Static method to get popular searches
searchSchema.statics.getPopularSearches = async function(limit = 10) {
  return await this.find({ user: null })
    .sort({ searchCount: -1, timestamp: -1 })
    .limit(limit)
    .select('query searchCount');
};

// Static method to get user search history
searchSchema.statics.getUserSearchHistory = async function(userId, limit = 10) {
  return await this.find({ user: userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('query timestamp resultsCount');
};

module.exports = mongoose.model('Search', searchSchema);