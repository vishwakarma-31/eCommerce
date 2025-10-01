import React, { useState } from 'react';
import RatingStars from './RatingStars';
import Button from '../common/Button';
import Input from '../common/Input';

const ReviewForm = ({ onSubmit, onCancel, initialRating = 0 }) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (!comment.trim()) {
      newErrors.comment = 'Please enter your review';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating <span className="text-red-500">*</span>
        </label>
        <RatingStars 
          rating={rating} 
          onRatingChange={setRating} 
          editable={true} 
          size="lg" 
        />
        {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
      </div>
      
      <Input
        label="Review"
        id="comment"
        placeholder="Share your experience with this product..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        error={errors.comment}
        required
        className="h-24"
      />
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Submit Review
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;