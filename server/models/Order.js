const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductConcept',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  stripePaymentIntentId: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
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
  },
  trackingNumber: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  },
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Critical Indexes for Performance
orderSchema.index({ buyer: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);