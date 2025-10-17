const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  isDefault: {
    type: Boolean,
    default: false
  }
});

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
  // Updated address field to support multiple addresses
  addresses: [addressSchema],
  backedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PreOrder'
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductConcept'
  }],
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },
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
  emailVerificationToken: {
    type: String
  },
  emailVerificationExpires: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Email preferences
  emailPreferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: true
    },
    promotional: {
      type: Boolean,
      default: true
    }
  },
  // Notification preferences
  pushNotifications: {
    type: Boolean,
    default: true
  },
  inAppNotifications: {
    type: Boolean,
    default: true
  },
  // Recently viewed products
  recentlyViewed: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductConcept'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Security fields for account lockout
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to increment failed login attempts
userSchema.methods.incLoginAttempts = function() {
  // If first failed attempt, set lockUntil to current time
  if (this.failedLoginAttempts === 0) {
    this.lockUntil = Date.now();
  }
  
  // Increment failed attempts
  this.failedLoginAttempts++;
  
  // If failed attempts reach 5, lock account for 1 hour
  if (this.failedLoginAttempts >= 5) {
    this.lockUntil = Date.now() + 60 * 60 * 1000; // 1 hour
  }
  
  return this.save();
};

// Method to reset login attempts after successful login
userSchema.methods.resetLoginAttempts = function() {
  this.failedLoginAttempts = 0;
  this.lockUntil = undefined;
  return this.save();
};

// Add indexes for frequently queried fields
userSchema.index({ email: 1 }); // Critical index for login/registration
userSchema.index({ role: 1 }); // Critical index for role-based queries
userSchema.index({ emailVerificationToken: 1 }); // Index for email verification
userSchema.index({ lockUntil: 1 }); // Index for lockout checks

module.exports = mongoose.model('User', userSchema);