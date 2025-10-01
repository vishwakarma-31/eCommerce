import React from 'react';
import RatingStars from './RatingStars';

const ReviewCard = ({ review }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{review.user.name}</p>
            <div className="flex items-center">
              <RatingStars rating={review.rating} size="sm" />
              <span className="ml-2 text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-gray-700">{review.comment}</p>
      </div>
      {review.response && (
        <div className="mt-3 ml-4 pl-4 border-l-2 border-indigo-200">
          <div className="flex items-center">
            <p className="text-sm font-medium text-indigo-600">Creator Response</p>
          </div>
          <div className="mt-1">
            <p className="text-gray-700">{review.response}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;