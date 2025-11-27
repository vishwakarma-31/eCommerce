import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import Button from '../components/common/Button';

const ProductComparisonPage = () => {
  const navigate = useNavigate();
  const { comparedProducts, removeFromComparison } = useComparison();

  const getUniqueSpecs = () => {
    const specs = new Set();
    comparedProducts.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(spec => {
          specs.add(spec);
        });
      }
    });
    return Array.from(specs);
  };

  const uniqueSpecs = getUniqueSpecs();

  if (comparedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No products to compare</h2>
          <p className="text-gray-600 mb-6">Add products to comparison to see differences side by side.</p>
          <Button onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Product Comparison
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Features
              </th>
              {comparedProducts.map((product) => (
                <th key={product._id} className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => removeFromComparison(product._id)}
                      className="text-red-600 hover:text-red-900 mb-2"
                    >
                      Remove
                    </button>
                    <div className="w-24 h-24 mb-2">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
                    <p className="text-lg font-bold text-indigo-600">${product.price?.toFixed(2) || 'N/A'}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Rating
              </td>
              {comparedProducts.map((product) => (
                <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <div className="flex items-center justify-center">
                    <svg className="text-yellow-400 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1">{product.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Category
              </td>
              {comparedProducts.map((product) => (
                <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {product.category || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Brand
              </td>
              {comparedProducts.map((product) => (
                <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {product.brand || 'N/A'}
                </td>
              ))}
            </tr>
            {uniqueSpecs.map((spec) => (
              <tr key={spec}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                  {spec.replace(/([A-Z])/g, ' $1').trim()}
                </td>
                {comparedProducts.map((product) => (
                  <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {product.specifications?.[spec] || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default ProductComparisonPage;