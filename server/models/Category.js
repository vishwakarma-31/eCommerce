const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true
});

// Generate slug before saving
categorySchema.pre('save', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

// Add indexes
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });

module.exports = mongoose.model('Category', categorySchema);