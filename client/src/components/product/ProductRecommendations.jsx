import React, { useState, useEffect } from 'react';
import { recommendationService } from '../../services/recommendationService';
import ProductGrid from './ProductGrid';
import Loader from '../common/Loader';

const ProductRecommendations = ({ type = 'personalized', limit = 8 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        switch (type) {
          case 'trending':
            response = await recommendationService.getTrendingProducts(limit);
            break;
          case 'browsing':
            response = await recommendationService.getBrowsingHistoryRecommendations(limit);
            break;
          case 'cart':
            response = await recommendationService.getCartBasedRecommendations(limit);
            break;
          case 'personalized':
          default:
            response = await recommendationService.getPersonalizedRecommendations(limit);
            break;
        }
        
        setProducts(response.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load recommendations');
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [type, limit]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  const getTitle = () => {
    switch (type) {
      case 'trending':
        return 'Trending Products';
      case 'browsing':
        return 'Based on Your Browsing History';
      case 'cart':
        return 'Based on Your Cart';
      case 'personalized':
      default:
        return 'Recommended for You';
    }
  };

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{getTitle()}</h2>
      <ProductGrid products={products} />
    </section>
  );
};

export default ProductRecommendations;