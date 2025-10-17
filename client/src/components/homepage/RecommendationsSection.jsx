import React from 'react';
import ProductRecommendations from '../product/ProductRecommendations';

const RecommendationsSection = () => {
  return (
    <div className="mt-16">
      {/* Personalized Recommendations */}
      <ProductRecommendations type="personalized" limit={8} />
      
      {/* Trending Products */}
      <ProductRecommendations type="trending" limit={8} />
      
      {/* Based on Browsing History */}
      <ProductRecommendations type="browsing" limit={8} />
      
      {/* Based on Cart Items */}
      <ProductRecommendations type="cart" limit={8} />
    </div>
  );
};

export default RecommendationsSection;