import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import ProductComparison from '../components/product/ProductComparison';
import Loader from '../components/common/Loader';

const ProductComparisonPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Get product IDs from URL search params
        const searchParams = new URLSearchParams(location.search);
        const productIds = searchParams.getAll('product');
        
        if (productIds.length === 0) {
          // If no products specified, fetch some random products
          const response = await productService.getProducts({
            limit: 12
          });
          setProducts(response.data.products || []);
        } else {
          // Fetch specific products
          const productPromises = productIds.map(id => productService.getProductById(id));
          const productResponses = await Promise.all(productPromises);
          setProducts(productResponses.map(response => response.data));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/products')}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Browse all products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Comparison</h1>
        <p className="mt-2 text-gray-600">
          Compare features, prices, and ratings of similar products side-by-side.
        </p>
      </div>
      
      <ProductComparison products={products} />
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => navigate('/products')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Browse More Products
        </button>
      </div>
    </div>
  );
};

export default ProductComparisonPage;