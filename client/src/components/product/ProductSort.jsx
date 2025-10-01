import React from 'react';

const ProductSort = ({ sortBy, sortOrder, onSortChange }) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="flex items-center">
        <label htmlFor="sort-by" className="mr-2 text-sm font-medium text-gray-700">
          Sort by:
        </label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => onSortChange({ ...sortOrder, sortBy: e.target.value })}
          className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          <option value="averageRating">Rating</option>
          <option value="views">Popularity</option>
          <option value="currentFunding">Funding Progress</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <label htmlFor="sort-order" className="mr-2 text-sm font-medium text-gray-700">
          Order:
        </label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => onSortChange({ ...sortBy, sortOrder: e.target.value })}
          className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
};

export default ProductSort;