import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';

const ProductComparison = ({ products }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const toggleProductSelection = (product) => {
    if (selectedProducts.some(p => p._id === product._id)) {
      setSelectedProducts(selectedProducts.filter(p => p._id !== product._id));
    } else if (selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p._id !== productId));
  };

  const renderComparisonRow = (label, getValue) => (
    <tr className="border-b border-gray-200">
      <td className="py-4 px-4 text-sm font-medium text-gray-900">{label}</td>
      {selectedProducts.map((product) => (
        <td key={product._id} className="py-4 px-4 text-sm text-gray-500 text-center">
          {getValue(product)}
        </td>
      ))}
    </tr>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Compare Products</h3>
      
      {selectedProducts.length > 0 ? (
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            {selectedProducts.map((product) => (
              <div key={product._id} className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full" />
                  )}
                </div>
                <div className="ml-2 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                </div>
                <button 
                  onClick={() => removeProduct(product._id)}
                  className="ml-2 text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Feature</th>
                  {selectedProducts.map((product) => (
                    <th key={product._id} className="py-3 px-4 text-center text-sm font-medium text-gray-500">
                      {product.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {renderComparisonRow('Price', (product) => `$${product.price.toFixed(2)}`)}
                {renderComparisonRow('Category', (product) => product.category)}
                {renderComparisonRow('Rating', (product) => (
                  <div className="flex items-center justify-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-500">
                      {product.averageRating.toFixed(1)}
                    </span>
                  </div>
                ))}
                {renderComparisonRow('Funding Goal', (product) => (
                  product.fundingGoal ? `$${product.fundingGoal}` : 'N/A'
                ))}
                {renderComparisonRow('Current Funding', (product) => (
                  product.currentFunding ? `$${product.currentFunding}` : 'N/A'
                ))}
                {renderComparisonRow('Funding Progress', (product) => (
                  product.fundingGoal ? (
                    <div className="w-full">
                      <ProgressBar 
                        current={product.currentFunding} 
                        total={product.fundingGoal} 
                        showLabel={false}
                      />
                    </div>
                  ) : 'N/A'
                ))}
                {renderComparisonRow('Days Left', (product) => (
                  product.deadline ? (
                    Math.ceil((new Date(product.deadline) - new Date()) / (1000 * 60 * 60 * 24))
                  ) : 'N/A'
                ))}
                {renderComparisonRow('Creator', (product) => product.creator?.name || 'Unknown')}
                <tr>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">Actions</td>
                  {selectedProducts.map((product) => (
                    <td key={product._id} className="py-4 px-4 text-center">
                      <Link 
                        to={`/product/${product._id}`} 
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-gradient shadow-sm hover:shadow-md"
                      >
                        View Details
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select up to 3 products to compare their features.
          </p>
        </div>
      )}
      
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-3">
          {selectedProducts.length > 0 ? 'Add more products to compare' : 'Select products to compare'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products
            .filter(product => !selectedProducts.some(p => p._id === product._id))
            .slice(0, 6)
            .map((product) => (
              <div 
                key={product._id} 
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full" />
                    )}
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                    <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => toggleProductSelection(product)}
                    disabled={selectedProducts.length >= 3 && !selectedProducts.some(p => p._id === product._id)}
                    className={`ml-2 inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      selectedProducts.some(p => p._id === product._id)
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    } ${selectedProducts.length >= 3 && !selectedProducts.some(p => p._id === product._id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;