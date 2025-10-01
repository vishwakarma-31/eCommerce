/**
 * Improved Product Card Component following frontend code quality standards
 * This is an example of how components should be structured
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RatingStars from '../review/RatingStars';

/**
 * ProductCard component displays product information in a card format
 * @param {Object} product - The product object to display
 * @param {Function} onAddToCart - Function to call when add to cart button is clicked
 */
const ProductCard = ({ product, onAddToCart }) => {
  // Handle add to cart click
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart && typeof onAddToCart === 'function') {
      onAddToCart(product);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Render product image
  const renderProductImage = () => {
    if (product.images && product.images.length > 0) {
      return (
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      );
    }
    
    return (
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No image</span>
      </div>
    );
  };

  // Render featured badge
  const renderFeaturedBadge = () => {
    if (product.isFeatured) {
      return (
        <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
          Featured
        </span>
      );
    }
    return null;
  };

  // Render funding badge
  const renderFundingBadge = () => {
    if (product.status === 'Funding') {
      return (
        <span className="absolute top-2 right-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
          Funding
        </span>
      );
    }
    return null;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      data-testid="product-card"
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative">
          {renderProductImage()}
          {renderFeaturedBadge()}
          {renderFundingBadge()}
        </div>
        
        <div className="p-4">
          <h3 
            className="text-lg font-medium text-gray-900 truncate" 
            title={product.title}
          >
            {product.title}
          </h3>
          
          <p className="mt-1 text-sm text-gray-500 truncate">
            {product.category}
          </p>
          
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-900">
              {formatPrice(product.price)}
            </p>
            
            {product.averageRating > 0 && (
              <div className="flex items-center">
                <RatingStars rating={product.averageRating} size="sm" />
                <span className="ml-1 text-sm text-gray-500">
                  ({product.totalReviews})
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          aria-label={`Add ${product.title} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// Define prop types for type checking
ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    category: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    isFeatured: PropTypes.bool,
    status: PropTypes.string,
    averageRating: PropTypes.number,
    totalReviews: PropTypes.number
  }).isRequired,
  onAddToCart: PropTypes.func
};

// Set default props
ProductCard.defaultProps = {
  onAddToCart: null
};

// Memoize component to prevent unnecessary re-renders
export default memo(ProductCard);