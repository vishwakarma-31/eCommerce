import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import productService from '../services/productService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import ProgressBar from '../components/product/ProgressBar';
import ReviewCard from '../components/review/ReviewCard';
import ReviewForm from '../components/review/ReviewForm';
import CommentCard from '../components/comment/CommentCard';
import CommentForm from '../components/comment/CommentForm';
import RatingStars from '../components/review/RatingStars';
import LiveFundingAnimation from '../components/product/LiveFundingAnimation';
import EarlyBirdRewards from '../components/product/EarlyBirdRewards';
import ProjectUpdates from '../components/product/ProjectUpdates';
import SocialSharing from '../components/product/SocialSharing';
import EmailNotifications from '../components/product/EmailNotifications';
import SuccessPredictionBadge from '../components/product/SuccessPredictionBadge';
import CreatorVerificationBadge from '../components/product/CreatorVerificationBadge';
import BackerLeaderboard from '../components/product/BackerLeaderboard';
import LazyImage from '../components/common/LazyImage';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Memoize the funding progress calculation
  const fundingProgress = useMemo(() => {
    if (!product || !product.fundingGoal) return 0;
    return Math.min(100, Math.round((product.currentFunding / product.fundingGoal) * 100));
  }, [product]);

  // Memoize the days left calculation
  const daysLeft = useMemo(() => {
    if (!product || !product.deadline) return null;
    return Math.ceil((new Date(product.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  }, [product]);

  const handleBackProject = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // In a real implementation, this would initiate the pre-order process
    alert('Pre-order functionality would be implemented here');
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (product.status === 'Funding') {
      handleBackProject();
      return;
    }
    
    addToCart(product, quantity);
  };

  const handleReviewSubmit = (reviewData) => {
    // In a real implementation, this would call the review service
    console.log('Review submitted:', reviewData);
    setShowReviewForm(false);
  };

  const handleCommentSubmit = (commentData) => {
    // In a real implementation, this would call the comment service
    console.log('Comment submitted:', commentData);
    setNewComment('');
  };

  const handleNewBacker = (backer) => {
    // Handle new backer notification
    console.log('New backer:', backer);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const isFunding = product.status === 'Funding';
  const isMarketplace = product.status === 'Marketplace';

  // Mock data for the features
  const mockBackers = [
    { id: 1, name: 'Alex Johnson', projectsSupported: 12, totalSpent: 420, backsCount: 8 },
    { id: 2, name: 'Sam Wilson', projectsSupported: 8, totalSpent: 310, backsCount: 5 },
    { id: 3, name: 'Jordan Lee', projectsSupported: 15, totalSpent: 580, backsCount: 12 },
    { id: 4, name: 'Taylor Kim', projectsSupported: 6, totalSpent: 220, backsCount: 4 },
    { id: 5, name: 'Morgan Reed', projectsSupported: 10, totalSpent: 350, backsCount: 7 }
  ];

  const mockUpdates = [
    { id: 1, title: 'Prototype Testing Complete', content: 'We\'ve finished testing the prototype and made some great improvements based on feedback.', creatorName: product.creator?.name || 'Creator', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), likes: 12 },
    { id: 2, title: 'Design Finalized', content: 'The final design has been approved and we\'re moving into the production phase.', creatorName: product.creator?.name || 'Creator', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), likes: 8 },
    { id: 3, title: 'Funding Milestone Reached', content: 'We\'ve hit 50% of our funding goal! Thank you all for your support.', creatorName: product.creator?.name || 'Creator', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), likes: 24 }
  ];

  const mockEarlyBirdRewards = [
    { title: 'Early Bird Special', description: 'First 50 backers get 30% off', originalPrice: product.price, discountedPrice: (product.price * 0.7).toFixed(2), limit: 50 },
    { title: 'Super Early Bird', description: 'First 25 backers get 40% off', originalPrice: product.price, discountedPrice: (product.price * 0.6).toFixed(2), limit: 25 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div>
          <div className="bg-gray-200 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <LazyImage 
                src={product.images[0]} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500">No image available</span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {product.images && product.images.slice(1, 5).map((image, index) => (
              <div key={index} className="bg-gray-200 rounded-lg overflow-hidden aspect-square">
                <LazyImage 
                  src={image} 
                  alt={`${product.title} ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            {product.creator && product.creator.isVerified && (
              <CreatorVerificationBadge isVerified={product.creator.isVerified} size="md" />
            )}
          </div>
          
          {isFunding && product.successProbability && (
            <div className="mb-3">
              <SuccessPredictionBadge probability={product.successProbability} size="md" />
            </div>
          )}
          
          <div className="flex items-center mb-4">
            <RatingStars rating={product.averageRating} />
            <span className="ml-2 text-gray-600">
              {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
            </span>
          </div>
          
          <p className="text-2xl font-bold text-gray-900 mb-4">${product.price.toFixed(2)}</p>
          
          <div className="prose max-w-none text-gray-600 mb-6">
            <p>{product.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Category</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {product.category}
            </span>
          </div>
          
          {isFunding && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Funding Progress</h3>
              <ProgressBar 
                current={product.currentFunding} 
                total={product.fundingGoal} 
                label="backers" 
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{product.currentFunding} of {product.fundingGoal} backers</span>
                <span>
                  {daysLeft} days left
                </span>
              </div>
            </div>
          )}
          
          {isFunding && (
            <LiveFundingAnimation 
              currentFunding={product.currentFunding} 
              fundingGoal={product.fundingGoal} 
              onNewBacker={handleNewBacker}
            />
          )}
          
          {isFunding && product.earlyBirdRewards && product.earlyBirdRewards.length > 0 && (
            <EarlyBirdRewards 
              rewards={product.earlyBirdRewards} 
              backersCount={product.currentFunding}
            />
          )}
          
          {isMarketplace && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border border-gray-300 rounded-l-md"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-3 py-1 border-t border-b border-gray-300 text-center"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border border-gray-300 rounded-r-md"
                >
                  +
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1"
            >
              {isFunding ? 'Back This Project' : 'Add to Cart'}
            </Button>
            
            {isAuthenticated && (
              <Button variant="outline" className="flex-1">
                Add to Wishlist
              </Button>
            )}
          </div>
          
          {/* Creator Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Created by</h3>
                <p className="text-sm text-gray-600">{product.creator?.name || 'Unknown Creator'}</p>
              </div>
            </div>
            <div className="mt-3">
              <Link to={`/creator/${product.creator?._id}`} className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                View creator profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Social Sharing */}
      {isFunding && (
        <SocialSharing product={product} fundingProgress={fundingProgress} />
      )}

      {/* Email Notifications */}
      {isAuthenticated && isFunding && (
        <EmailNotifications product={product} user={currentUser} />
      )}

      {/* Backer Leaderboard */}
      {isFunding && (
        <BackerLeaderboard backers={mockBackers} />
      )}

      {/* Project Updates */}
      {isFunding && (
        <ProjectUpdates 
          updates={mockUpdates} 
          canPostUpdates={isAuthenticated && currentUser?._id === product.creator?._id}
        />
      )}

      {/* Comments Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
        
        {isAuthenticated ? (
          <div className="mb-8">
            <CommentForm 
              onSubmit={handleCommentSubmit} 
              placeholder="Share your thoughts about this product..."
            />
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
            <p className="text-gray-600 mb-4">Please log in to leave a comment.</p>
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Log in to comment
            </Link>
          </div>
        )}
        
        <div>
          {product.comments && product.comments.length > 0 ? (
            product.comments.map((comment) => (
              <CommentCard key={comment._id} comment={comment} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          {isAuthenticated && !showReviewForm && (
            <Button variant="outline" onClick={() => setShowReviewForm(true)}>
              Write a Review
            </Button>
          )}
        </div>
        
        {showReviewForm ? (
          <div className="mb-8">
            <ReviewForm 
              onSubmit={handleReviewSubmit} 
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        ) : !isAuthenticated && product.reviews && product.reviews.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
            <p className="text-gray-600 mb-4">Please log in to write a review.</p>
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Log in to review
            </Link>
          </div>
        ) : null}
        
        <div>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;