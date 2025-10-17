import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from './ProgressBar';
import SuccessPredictionBadge from './SuccessPredictionBadge';
import CreatorVerificationBadge from './CreatorVerificationBadge';
import LazyImage from '../common/LazyImage';
import Button from '../common/Button';
import ProductQuickView from './ProductQuickView';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [showQuickView, setShowQuickView] = useState(false);
  const isWishlisted = isInWishlist(product._id);
  
  const isFunding = product.status === 'Funding';
  const isMarketplace = product.status === 'Marketplace';
  
  // Memoize the days left calculation
  const daysLeft = useMemo(() => {
    if (!isFunding || !product.deadline) return null;
    return Math.ceil((new Date(product.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  }, [isFunding, product.deadline]);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }
    
    addToCart(product, 1);
  };
  
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }
    
    addToWishlist(product);
  };
  
  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
        <Link to={`/product/${product._id}`}>
          <div className="relative">
            {product.images && product.images.length > 0 ? (
              <LazyImage 
                src={product.images[0]} 
                alt={product.title} 
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            {product.isFeatured && (
              <span className="absolute top-2 left-2 bg-warning-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Featured
              </span>
            )}
            {isFunding && (
              <span className="absolute top-2 right-2 bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                Funding
              </span>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900 truncate">{product.title}</h3>
              {product.creator && product.creator.isVerified && (
                <CreatorVerificationBadge isVerified={product.creator.isVerified} size="sm" />
              )}
            </div>
            
            <p className="mt-1 text-sm text-gray-500 truncate">{product.category}</p>
            
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>
            
            {isFunding && product.successProbability && (
              <div className="mt-2">
                <SuccessPredictionBadge probability={product.successProbability} size="sm" />
              </div>
            )}
            
            {isFunding && (
              <div className="mt-3">
                <ProgressBar 
                  current={product.currentFunding} 
                  total={product.fundingGoal} 
                  label="funded" 
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{product.currentFunding} backers</span>
                  <span>
                    {daysLeft} days left
                  </span>
                </div>
              </div>
            )}
            
            {product.averageRating > 0 && (
              <div className="mt-2 flex items-center">
                <div className="flex text-warning-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.averageRating) ? 'text-warning-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-500">
                  {product.averageRating.toFixed(1)} ({product.totalReviews})
                </span>
              </div>
            )}
          </div>
        </Link>
        
        {/* Action Buttons */}
        <div className="px-4 pb-4 flex space-x-2">
          <Button
            onClick={handleAddToCart}
            className="flex-1 text-sm"
            disabled={!isMarketplace}
            title={!isMarketplace ? "Product not available for purchase" : "Add to Cart"}
          >
            {isFunding ? 'Back Project' : 'Add to Cart'}
          </Button>
          <Button
            variant="outline"
            onClick={handleAddToWishlist}
            className="px-3"
            title="Add to Wishlist"
          >
            <svg 
              className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
              fill={isWishlisted ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Button>
          <Button
            variant="outline"
            onClick={handleQuickView}
            className="px-3"
            title="Quick View"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Quick View Modal */}
      {showQuickView && (
        <ProductQuickView 
          product={product} 
          onClose={() => setShowQuickView(false)} 
        />
      )}
    </>
  );
};

export default ProductCard;