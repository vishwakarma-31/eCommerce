import React from 'react';
import { formatCurrency } from '../../utils/formatUtils';
import LazyImage from '../common/LazyImage';

const ProductComparisonTable = ({ products, onRemove }) => {
  // Calculate funding progress for each product
  const getFundingProgress = (product) => {
    if (product.status !== 'Funding') return null;
    return Math.round((product.currentFunding / product.fundingGoal) * 100);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      Funding: 'bg-blue-100 text-blue-800',
      Successful: 'bg-green-100 text-green-800',
      Failed: 'bg-red-100 text-red-800',
      InProduction: 'bg-yellow-100 text-yellow-800',
      Marketplace: 'bg-purple-100 text-purple-800',
      OutOfStock: 'bg-gray-100 text-gray-800',
      Discontinued: 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            {products.map((product) => (
              <th key={product._id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => onRemove(product._id)}
                    className="ml-auto text-gray-400 hover:text-gray-600 mb-2"
                  >
                    ✕
                  </button>
                  <LazyImage
                    src={product.images[0]}
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded-md mb-2"
                  />
                  <h3 className="font-medium text-gray-900 text-center">{product.title}</h3>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Price */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Price
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {formatCurrency(product.price)}
              </td>
            ))}
          </tr>

          {/* Category */}
          <tr className="bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Category
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {product.category}
              </td>
            ))}
          </tr>

          {/* Status */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Status
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(product.status)}`}>
                  {product.status}
                </span>
              </td>
            ))}
          </tr>

          {/* Funding Progress (only for funding products) */}
          <tr className="bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Funding Progress
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {product.status === 'Funding' ? (
                  <div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getFundingProgress(product)}%` }}
                      ></div>
                    </div>
                    <span>{getFundingProgress(product)}%</span>
                  </div>
                ) : (
                  <span>N/A</span>
                )}
              </td>
            ))}
          </tr>

          {/* Rating */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Rating
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                <div className="flex items-center justify-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>{product.averageRating.toFixed(1)}</span>
                  <span className="text-gray-400 ml-1">({product.totalReviews})</span>
                </div>
              </td>
            ))}
          </tr>

          {/* Creator */}
          <tr className="bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Creator
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {product.creator?.name || 'Unknown'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductComparisonTable;