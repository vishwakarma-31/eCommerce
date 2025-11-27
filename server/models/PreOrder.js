const mongoose = require('mongoose');

const preOrderSchema = new mongoose.Schema({
  backer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productConcept: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductConcept',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Authorized', 'Cancelled'],
    default: 'Authorized'
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

// Critical Indexes for Performance
preOrderSchema.index({ backer: 1 }); // Index for querying pre-orders by backer
preOrderSchema.index({ productConcept: 1 }); // Index for querying pre-orders by product
preOrderSchema.index({ status: 1 }); // Index for status-based queries

module.exports = mongoose.model('PreOrder', preOrderSchema);