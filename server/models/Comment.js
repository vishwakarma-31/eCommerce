const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productConcept: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductConcept',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }, // For nested replies
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);