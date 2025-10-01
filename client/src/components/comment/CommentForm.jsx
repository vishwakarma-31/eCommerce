import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const CommentForm = ({ onSubmit, onCancel, placeholder = "Write a comment..." }) => {
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!comment.trim()) {
      newErrors.comment = 'Please enter your comment';
    } else if (comment.trim().length < 5) {
      newErrors.comment = 'Comment must be at least 5 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({ comment });
    setComment(''); // Clear the form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="comment"
        placeholder={placeholder}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        error={errors.comment}
        required
        className="h-20"
      />
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          Post Comment
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;