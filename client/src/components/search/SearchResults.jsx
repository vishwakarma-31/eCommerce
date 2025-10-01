import React from 'react';
import { useSearch } from '../../context/SearchContext';
import ProductCard from '../product/ProductCard';
import Loader from '../common/Loader';

const SearchResults = ({ className = '' }) => {
  const { searchResults, loading, error } = useSearch();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {searchResults.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;