import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../common/LazyImage';
import { formatCurrency } from '../../utils/formatUtils';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Memoize formatted values to prevent recalculation on every render
  const formattedPrice = useMemo(() => {
    return formatCurrency(product.price);
  }, [product.price]);

  const fundingProgress = useMemo(() => {
    return Math.min(100, Math.round((product.currentFunding / product.fundingGoal) * 100));
  }, [product.currentFunding, product.fundingGoal]);

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Funding: 'bg-blue-100 text-blue-800',
      Successful: 'bg-green-100 text-green-800',
      Failed: 'bg-red-100 text-red-800',
      InProduction: 'bg-yellow-100 text-yellow-800',
      Marketplace: 'bg-purple-100 text-purple-800',
      OutOfStock: 'bg-gray-100 text-gray-800',
      Discontinued: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200"
      onClick={handleCardClick}
    >
      <div className="relative h-48">
        <LazyImage 
          src={product.images[0]} 
          alt={product.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          {getStatusBadge(product.status)}
        </div>
        {product.isFeatured && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-indigo-600">{formattedPrice}</span>
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>
        
        {product.status === 'Funding' && (
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Funding Progress</span>
              <span>{fundingProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${fundingProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{product.currentFunding} backers</span>
              <span>{product.fundingGoal} goal</span>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">★</span>
            <span className="text-sm font-medium">{product.averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500 ml-1">({product.totalReviews})</span>
          </div>
          <span className="text-sm text-gray-500">{new Date(product.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);