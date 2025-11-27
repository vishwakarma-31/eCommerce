import React from 'react';
import Button from '../common/Button';

const SortingDropdown = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'createdAt:desc', label: 'Newest' },
    { value: 'createdAt:asc', label: 'Oldest' },
    { value: 'price:asc', label: 'Price: Low to High' },
    { value: 'price:desc', label: 'Price: High to Low' },
    { value: 'rating:desc', label: 'Top Rated' },
    { value: 'sales:desc', label: 'Best Selling' },
    { value: 'views:desc', label: 'Most Viewed' }
  ];

  return (
    <div className="relative inline-block text-left">
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortingDropdown;