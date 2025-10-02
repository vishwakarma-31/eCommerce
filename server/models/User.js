const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Backer', 'Creator', 'Admin'],
    default: 'Backer'
  },
  profileImage: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500
  },
  phone: {
    type: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  backedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PreOrder'
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductConcept'
  }],
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductConcept'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  // Following system - users can follow creators
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Referral system
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add indexes for frequently queried fields
userSchema.index({ email: 1 }); // Critical index for login/registration
userSchema.index({ role: 1 }); // Critical index for role-based queries

module.exports = mongoose.model('User', userSchema);