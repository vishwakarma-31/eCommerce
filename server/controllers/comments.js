const Comment = require('../models/Comment');
const ProductConcept = require('../models/ProductConcept');
const User = require('../models/User');
const { protect, isBacker } = require('../middleware/auth');
const { sendNewCommentEmail } = require('../services/emailService');

// Get all comments for a product
const getProductComments = async (req, res) => {
  try {
    const comments = await Comment.find({ productConcept: req.params.productId })
      .populate('author', 'name profileImage')
      .populate('replies')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { productConcept, text } = req.body;
    
    // Check if product exists
    const product = await ProductConcept.findById(productConcept);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Create comment
    const comment = new Comment({
      author: req.user._id,
      productConcept,
      text
    });
    
    const createdComment = await comment.save();
    
    // Populate author info
    await createdComment.populate('author', 'name profileImage');
    
    // Send notification to product creator
    try {
      const creator = await User.findById(product.creator);
      if (creator && creator.email) {
        await sendNewCommentEmail(createdComment, creator, product);
      }
    } catch (emailError) {
      console.error('Failed to send new comment email:', emailError);
      // Don't fail the comment creation if email sending fails
    }
    
    res.status(201).json(createdComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reply to a comment
const replyToComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;
    
    // Check if parent comment exists
    const parentComment = await Comment.findById(id);
    if (!parentComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Create reply
    const reply = new Comment({
      author: req.user._id,
      productConcept: parentComment.productConcept,
      text,
      parentComment: id
    });
    
    const createdReply = await reply.save();
    
    // Add reply to parent comment
    parentComment.replies.push(createdReply._id);
    await parentComment.save();
    
    // Populate author info
    await createdReply.populate('author', 'name profileImage');
    
    // Send notification to parent comment author
    try {
      const parentAuthor = await User.findById(parentComment.author);
      if (parentAuthor && parentAuthor.email) {
        const product = await ProductConcept.findById(parentComment.productConcept);
        await sendNewCommentEmail(createdReply, parentAuthor, product);
      }
    } catch (emailError) {
      console.error('Failed to send reply notification email:', emailError);
      // Don't fail the reply creation if email sending fails
    }
    
    res.status(201).json(createdReply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update own comment
const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user owns this comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    comment.text = text || comment.text;
    
    const updatedComment = await comment.save();
    
    // Populate author info
    await updatedComment.populate('author', 'name profileImage');
    
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete own comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user owns this comment or is admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // If this is a reply, remove it from parent comment
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id }
      });
    }
    
    await comment.remove();
    
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/unlike comment
const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // In a real implementation, we would track which users liked the comment
    // For now, we'll just increment the likes count
    comment.likes += 1;
    await comment.save();
    
    res.json({ message: 'Comment liked', likes: comment.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductComments,
  createComment,
  replyToComment,
  updateComment,
  deleteComment,
  likeComment
};