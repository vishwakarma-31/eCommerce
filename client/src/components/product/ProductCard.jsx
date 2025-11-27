import React from 'react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../common/LazyImage';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48">
        {product.images && product.images.length > 0 ? (
          <LazyImage
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
        
        {product.isFeatured && (
          <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        )}
        
        {product.discountPrice && product.discountPrice < product.price && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
        
        <div className="mt-2 flex items-center justify-between">
          <div>
            {product.discountPrice && product.discountPrice < product.price ? (
              <>
                <span className="text-lg font-bold text-gray-900">${product.discountPrice.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">${product.price?.toFixed(2) || 'N/A'}</span>
            )}
          </div>
          
          {product.rating && (
            <div className="flex items-center">
              <svg className="text-yellow-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-sm text-gray-600">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;