import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useComparison } from '../context/ComparisonContext';
import ProductComparisonTable from '../components/comparison/ProductComparisonTable';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const ProductComparisonPage = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { comparisonItems, removeFromComparison, clearComparison } = useComparison();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveFromComparison = (productId) => {
    removeFromComparison(productId);
    toast.success('Product removed from comparison');
  };

  const handleClearComparison = () => {
    clearComparison();
    toast.success('Comparison cleared');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Comparison</h1>
          <p className="mt-2 text-gray-600">
            Compare products side by side to make the best decision
          </p>
        </div>
        {comparisonItems.length > 0 && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={handleClearComparison}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {comparisonItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No products to compare</h2>
          <p className="text-gray-500 mb-6">Add products to compare them side by side</p>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <p className="text-gray-600">
              Comparing {comparisonItems.length} product{comparisonItems.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <ProductComparisonTable 
            products={comparisonItems} 
            onRemove={handleRemoveFromComparison}
          />
        </div>
      )}
    </div>
  );
};

export default ProductComparisonPage;