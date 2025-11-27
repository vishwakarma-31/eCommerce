import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const ProductListItem = ({ product }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="flex">
        <div className="w-1/4">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.title} 
              className="w-full h-32 object-cover"
            />
          ) : (
            <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>
        <div className="w-3/4 p-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-bold text-gray-900">{product.title}</h3>
            <p className="text-lg font-semibold text-gray-900">${product.price?.toFixed(2) || 'N/A'}</p>
          </div>
          <p className="text-sm text-gray-500 mt-1">{product.category}</p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
          <div className="mt-4 flex space-x-2">
            <Button onClick={handleViewDetails}>
              View Details
            </Button>
            <Button variant="outline">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;