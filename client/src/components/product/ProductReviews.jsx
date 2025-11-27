import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Loader from '../common/Loader';
import productService from '../../services/productService';

const ProductReviews = ({ product, onReviewAdded }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState(product.reviews || []);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please log in to submit a review');
      return;
    }
    
    if (!newReview.title.trim() || !newReview.comment.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const reviewData = {
        rating: parseInt(newReview.rating),
        title: newReview.title,
        comment: newReview.comment
      };
      
      const updatedProduct = await productService.addReview(product._id, reviewData);
      setReviews(updatedProduct.reviews);
      setNewReview({
        rating: 5,
        title: '',
        comment: ''
      });
      setShowReviewForm(false);
      
      if (onReviewAdded) {
        onReviewAdded(updatedProduct);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleHelpfulClick = async (reviewId) => {
    if (!isAuthenticated) {
      setError('Please log in to mark a review as helpful');
      return;
    }
    
    try {
      const updatedProduct = await productService.markReviewAsHelpful(product._id, reviewId);
      setReviews(updatedProduct.reviews);
      
      if (onReviewAdded) {
        onReviewAdded(updatedProduct);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark review as helpful');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-500">({rating})</span>
      </div>
    );
  };

  return (
    <div className="mt-12">
      <div className="border-t border-gray-200 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          {isAuthenticated && (
            <Button
              variant="primary"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  id="rating"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Give your review a title"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Review
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Share your experience with this product"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Summary */}
        {reviews.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="text-3xl font-bold text-gray-900 mr-2">
                {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
              </div>
              {renderStars(product.averageRating || 0)}
              <div className="ml-4 text-sm text-gray-500">
                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews</h3>
              <p className="mt-1 text-sm text-gray-500">
                Be the first to review this product.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center">
                      <h4 className="text-lg font-medium text-gray-900">{review.title}</h4>
                      <div className="ml-4">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center">
                      <p className="text-sm text-gray-500">
                        by {review.user?.name || 'Anonymous'} on {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  {isAuthenticated && user._id !== review.user?._id && (
                    <button
                      onClick={() => handleHelpfulClick(review._id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        review.helpful.find(h => h.user === user._id) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      Helpful ({review.helpfulCount || 0})
                    </button>
                  )}
                </div>
                <div className="mt-4 text-gray-700">
                  <p>{review.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;