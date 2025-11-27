import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const TouchCarousel = ({ products, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link 
          to="/products" 
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          View all
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.slice(0, 5).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default TouchCarousel;