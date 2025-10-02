import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProductComparisonTable from '../components/comparison/ProductComparisonTable';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const ProductComparisonPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchComparisonProducts();
  }, []);

  const fetchComparisonProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/compare');
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch comparison products');
      console.error('Error fetching comparison products:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromComparison = async (productId) => {
    try {
      await api.delete(`/compare/remove/${productId}`);
      setProducts(products.filter(product => product._id !== productId));
      toast.success('Product removed from comparison');
    } catch (error) {
      toast.error('Failed to remove product from comparison');
      console.error('Error removing product from comparison:', error);
    }
  };

  const clearComparison = async () => {
    try {
      await api.delete('/compare/clear');
      setProducts([]);
      toast.success('Comparison cleared');
    } catch (error) {
      toast.error('Failed to clear comparison');
      console.error('Error clearing comparison:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Comparison</h1>
        {products.length > 0 && (
          <button
            onClick={clearComparison}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Clear All
          </button>
        )}
      </div>

      {products.length === 0 ? (
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
              Comparing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <ProductComparisonTable 
            products={products} 
            onRemove={removeFromComparison}
          />
        </div>
      )}
    </div>
  );
};

export default ProductComparisonPage;