import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import searchService from '../../services/searchService';

const FilterPanel = ({ onFilterChange, className = '' }) => {
  const { filters, filterProducts } = useSearch();
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    statuses: [],
    ratings: [],
    sortOptions: []
  });
  const [localFilters, setLocalFilters] = useState(filters);

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await searchService.getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      }
    };
    
    loadFilterOptions();
  }, []);

  // Update local filters when filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleCategoryChange = (category) => {
    const newCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];
      
    const newFilters = { ...localFilters, categories: newCategories };
    setLocalFilters(newFilters);
    filterProducts(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handlePriceChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value || null };
    setLocalFilters(newFilters);
    filterProducts(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleStatusChange = (status) => {
    const newFilters = { ...localFilters, status };
    setLocalFilters(newFilters);
    filterProducts(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleRatingChange = (minRating) => {
    const newFilters = { ...localFilters, minRating };
    setLocalFilters(newFilters);
    filterProducts(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy) => {
    const newFilters = { ...localFilters, sortBy };
    setLocalFilters(newFilters);
    filterProducts(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      categories: [],
      minPrice: null,
      maxPrice: null,
      status: '',
      minRating: null,
      sortBy: 'newest'
    };
    setLocalFilters(newFilters);
    filterProducts(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Clear all
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Category</h4>
        <div className="space-y-2">
          {filterOptions.categories.map((category) => (
            <div key={category} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category}`}
                checked={localFilters.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor={`category-${category}`}
                className="ml-2 text-sm text-gray-700"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Price Range</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min</label>
            <input
              type="number"
              value={localFilters.minPrice || ''}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              placeholder="0"
              className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max</label>
            <input
              type="number"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              placeholder="1000"
              className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Status</h4>
        <div className="space-y-2">
          {filterOptions.statuses.map((status) => (
            <div key={status} className="flex items-center">
              <input
                type="radio"
                id={`status-${status}`}
                name="status"
                checked={localFilters.status === status}
                onChange={() => handleStatusChange(status)}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label
                htmlFor={`status-${status}`}
                className="ml-2 text-sm text-gray-700"
              >
                {status}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Rating</h4>
        <div className="space-y-2">
          {filterOptions.ratings.map((rating) => (
            <div key={rating.value} className="flex items-center">
              <input
                type="radio"
                id={`rating-${rating.value}`}
                name="rating"
                checked={localFilters.minRating === rating.value}
                onChange={() => handleRatingChange(rating.value)}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label
                htmlFor={`rating-${rating.value}`}
                className="ml-2 text-sm text-gray-700"
              >
                {rating.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h4 className="font-medium mb-2">Sort By</h4>
        <select
          value={localFilters.sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {filterOptions.sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;