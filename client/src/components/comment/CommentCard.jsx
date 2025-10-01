import React, { useState } from 'react';
import CommentForm from './CommentForm';

const CommentCard = ({ comment, onReply, depth = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);

  const handleReplySubmit = (replyData) => {
    // In a real app, this would call an API to save the reply
    const newReply = {
      _id: Date.now().toString(),
      user: { name: 'Current User' }, // This would come from auth context
      comment: replyData.comment,
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    setReplies([...replies, newReply]);
    setShowReplyForm(false);
  };

  const handleNestedReply = (replyData, parentCommentId) => {
    // Handle nested replies
    const updateReplies = (replyList) => {
      return replyList.map(reply => {
        if (reply._id === parentCommentId) {
          const newReply = {
            _id: Date.now().toString(),
            user: { name: 'Current User' },
            comment: replyData.comment,
            createdAt: new Date().toISOString(),
            replies: []
          };
          return {
            ...reply,
            replies: [...reply.replies, newReply]
          };
        }
        if (reply.replies && reply.replies.length > 0) {
          return {
            ...reply,
            replies: updateReplies(reply.replies)
          };
        }
        return reply;
      });
    };
    
    setReplies(updateReplies(replies));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`${depth > 0 ? 'ml-8' : ''} border-b border-gray-200 py-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">{comment.user.name}</h4>
            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
          </div>
          <div className="mt-1 text-gray-700">
            <p>{comment.comment}</p>
          </div>
          <div className="mt-2">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Reply
            </button>
          </div>
          
          {showReplyForm && (
            <div className="mt-3">
              <CommentForm 
                onSubmit={handleReplySubmit} 
                onCancel={() => setShowReplyForm(false)}
                placeholder="Write a reply..."
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Render replies */}
      {replies.length > 0 && (
        <div className="mt-4">
          {replies.map((reply) => (
            <CommentCard 
              key={reply._id} 
              comment={reply} 
              onReply={handleNestedReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;