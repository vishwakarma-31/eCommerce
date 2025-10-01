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
  stripePaymentIntentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Authorized', 'Paid', 'Cancelled', 'Refunded'],
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
preOrderSchema.index({ backer: 1 });
preOrderSchema.index({ productConcept: 1 });
preOrderSchema.index({ status: 1 });

module.exports = mongoose.model('PreOrder', preOrderSchema);