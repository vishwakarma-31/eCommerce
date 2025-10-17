import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../product/ProductGrid';
import Loader from '../common/Loader';
import { userService } from '../../services/userService';

const HomepageRecentlyViewed = () => {
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
      // Only show up to 4 recently viewed products on homepage
      setRecentlyViewed(response.data.slice(0, 4) || []);
    } catch (err) {
      // Don't show error on homepage, just hide the section
      setRecentlyViewed([]);
    } finally {
      setLoading(false);
    }
  };

  // Don't show section if there are no recently viewed products
  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
        <Link to="/profile" className="text-indigo-600 hover:text-indigo-500">
          View all
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : (
        <ProductGrid products={recentlyViewed} />
      )}
    </section>
  );
};

export default HomepageRecentlyViewed;