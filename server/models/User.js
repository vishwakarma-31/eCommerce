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
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ referralCode: 1 });

// Generate referral code before saving
userSchema.pre('save', async function(next) {
  // Generate referral code if it doesn't exist
  if (!this.referralCode) {
    this.referralCode = this._id.toString().substring(0, 8).toUpperCase();
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);