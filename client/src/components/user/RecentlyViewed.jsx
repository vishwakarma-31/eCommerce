import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../product/ProductCard';
import Button from '../common/Button';
import Loader from '../common/Loader';
import userService from '../../services/userService';

const RecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentlyViewed();
  }, []);

  const fetchRecentlyViewed = async () => {
    try {
      setLoading(true);
      const response = await userService.getRecentlyViewed();
      setRecentlyViewed(response.data || []);
    } catch (err) {
      setError('Failed to load recently viewed products');
      console.error('Error fetching recently viewed products:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearRecentlyViewed = async () => {
    try {
      await userService.clearRecentlyViewed();
      setRecentlyViewed([]);
    } catch (err) {
      setError('Failed to clear recently viewed history');
      console.error('Error clearing recently viewed products:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recently Viewed</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Products you've recently viewed
            </p>
          </div>
          {recentlyViewed.length > 0 && (
            <Button
              variant="secondary"
              onClick={clearRecentlyViewed}
              size="sm"
            >
              Clear History
            </Button>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200">
        {recentlyViewed.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recently viewed products</h3>
            <p className="mt-1 text-sm text-gray-500">
              Products you view will appear here.
            </p>
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {recentlyViewed.map((item) => (
              <ProductCard 
                key={item._id} 
                product={item} 
                showCreator={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewed;