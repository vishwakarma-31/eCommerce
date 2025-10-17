import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

const ProductFilter = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState({
    category: '',
    subcategory: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    isFeatured: '',
    isNewArrival: '',
    isBestSeller: '',
    status: '',
    search: ''
  });

  // Update local filters when parent filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      category: '',
      subcategory: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      isFeatured: '',
      isNewArrival: '',
      isBestSeller: '',
      status: '',
      search: ''
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        
        {/* Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search products..."
          />
        </div>
        
        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={localFilters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home & Garden">Home & Garden</option>
            <option value="Sports & Outdoors">Sports & Outdoors</option>
            <option value="Books">Books</option>
            <option value="Toys & Games">Toys & Games</option>
          </select>
        </div>
        
        {/* Subcategory */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
          <select
            value={localFilters.subcategory}
            onChange={(e) => handleFilterChange('subcategory', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Subcategories</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Laptops">Laptops</option>
            <option value="Tablets">Tablets</option>
            <option value="Cameras">Cameras</option>
          </select>
        </div>
        
        {/* Brand */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
          <select
            value={localFilters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Brands</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Sony">Sony</option>
            <option value="Nike">Nike</option>
            <option value="Adidas">Adidas</option>
          </select>
        </div>
        
        {/* Price Range */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
            <input
              type="number"
              value={localFilters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input
              type="number"
              value={localFilters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="1000"
            />
          </div>
        </div>
        
        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
          <select
            value={localFilters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
        </div>
        
        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Draft">Draft</option>
            <option value="Marketplace">Marketplace</option>
            <option value="Funding">Funding</option>
          </select>
        </div>
        
        {/* Special Flags */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center">
            <input
              id="featured"
              type="checkbox"
              checked={localFilters.isFeatured === 'true'}
              onChange={(e) => handleFilterChange('isFeatured', e.target.checked ? 'true' : '')}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
              Featured Products
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="new-arrival"
              type="checkbox"
              checked={localFilters.isNewArrival === 'true'}
              onChange={(e) => handleFilterChange('isNewArrival', e.target.checked ? 'true' : '')}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="new-arrival" className="ml-2 text-sm text-gray-700">
              New Arrivals
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="best-seller"
              type="checkbox"
              checked={localFilters.isBestSeller === 'true'}
              onChange={(e) => handleFilterChange('isBestSeller', e.target.checked ? 'true' : '')}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="best-seller" className="ml-2 text-sm text-gray-700">
              Best Sellers
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" onClick={clearFilters} className="flex-1">
          Clear
        </Button>
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default ProductFilter;