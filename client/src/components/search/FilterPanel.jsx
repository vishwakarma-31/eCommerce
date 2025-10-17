import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';

const FilterPanel = ({ filters, onFilterChange, onClearAll }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const options = await productService.getFilterOptions();
        setCategories(options.categories || []);
        setBrands(options.brands || []);
        setColors(options.colors || []);
        setSizes(options.sizes || []);
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleCategoryChange = (category) => {
    const newCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];
    
    onFilterChange('category', newCategories.join(','));
  };

  const handleBrandChange = (brand) => {
    const newBrands = localFilters.brands.includes(brand)
      ? localFilters.brands.filter(b => b !== brand)
      : [...localFilters.brands, brand];
    
    onFilterChange('brand', newBrands.join(','));
  };

  const handleColorChange = (color) => {
    const newColors = localFilters.colors.includes(color)
      ? localFilters.colors.filter(c => c !== color)
      : [...localFilters.colors, color];
    
    onFilterChange('color', newColors.join(','));
  };

  const handleSizeChange = (size) => {
    const newSizes = localFilters.sizes.includes(size)
      ? localFilters.sizes.filter(s => s !== size)
      : [...localFilters.sizes, size];
    
    onFilterChange('size', newSizes.join(','));
  };

  const handleRatingChange = (rating) => {
    onFilterChange('rating', rating === localFilters.rating ? '' : rating);
  };

  const handleAvailabilityChange = (availability) => {
    onFilterChange('availability', availability === localFilters.availability ? '' : availability);
  };

  const handleDiscountChange = (discount) => {
    onFilterChange('discount', discount === localFilters.discount ? '' : discount);
  };

  const handlePriceChange = (min, max) => {
    onFilterChange('minPrice', min || '');
    onFilterChange('maxPrice', max || '');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button
          onClick={onClearAll}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-200 py-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Price Range</h4>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={localFilters.minPrice || ''}
            onChange={(e) => handlePriceChange(e.target.value, localFilters.maxPrice)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            placeholder="Max"
            value={localFilters.maxPrice || ''}
            onChange={(e) => handlePriceChange(localFilters.minPrice, e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="border-b border-gray-200 py-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Categories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  id={`category-${category}`}
                  name="category"
                  type="checkbox"
                  checked={localFilters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={`category-${category}`}
                  className="ml-3 text-sm text-gray-600"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <div className="border-b border-gray-200 py-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Brands</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center">
                <input
                  id={`brand-${brand}`}
                  name="brand"
                  type="checkbox"
                  checked={localFilters.brands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className="ml-3 text-sm text-gray-600"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ratings */}
      <div className="border-b border-gray-200 py-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Ratings</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <input
                id={`rating-${rating}`}
                name="rating"
                type="radio"
                checked={localFilters.rating === rating.toString()}
                onChange={() => handleRatingChange(rating.toString())}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`rating-${rating}`}
                className="ml-3 text-sm text-gray-600"
              >
                {rating}+ stars
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="border-b border-gray-200 py-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Availability</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="in-stock"
              name="availability"
              type="radio"
              checked={localFilters.availability === 'inStock'}
              onChange={() => handleAvailabilityChange('inStock')}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="in-stock"
              className="ml-3 text-sm text-gray-600"
            >
              In Stock
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="out-of-stock"
              name="availability"
              type="radio"
              checked={localFilters.availability === 'outOfStock'}
              onChange={() => handleAvailabilityChange('outOfStock')}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="out-of-stock"
              className="ml-3 text-sm text-gray-600"
            >
              Out of Stock
            </label>
          </div>
        </div>
      </div>

      {/* Discount */}
      <div className="border-b border-gray-200 py-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Discount</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="on-sale"
              name="discount"
              type="radio"
              checked={localFilters.discount === 'onSale'}
              onChange={() => handleDiscountChange('onSale')}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="on-sale"
              className="ml-3 text-sm text-gray-600"
            >
              On Sale
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="clearance"
              name="discount"
              type="radio"
              checked={localFilters.discount === 'clearance'}
              onChange={() => handleDiscountChange('clearance')}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="clearance"
              className="ml-3 text-sm text-gray-600"
            >
              Clearance
            </label>
          </div>
        </div>
      </div>

      {/* Colors */}
      {colors.length > 0 && (
        <div className="border-b border-gray-200 py-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Colors</h4>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`px-3 py-1 text-sm rounded-full border ${
                  localFilters.colors.includes(color)
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="border-b border-gray-200 py-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Sizes</h4>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`px-3 py-1 text-sm rounded-full border ${
                  localFilters.sizes.includes(size)
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* New Arrivals */}
      <div className="border-b border-gray-200 py-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">New Arrivals</h4>
        <div className="flex items-center">
          <input
            id="new-arrivals"
            name="newArrivals"
            type="checkbox"
            checked={localFilters.newArrivals === 'true'}
            onChange={(e) => onFilterChange('newArrivals', e.target.checked ? 'true' : '')}
            className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="new-arrivals"
            className="ml-3 text-sm text-gray-600"
          >
            Last 30 days
          </label>
        </div>
      </div>

      {/* Free Shipping */}
      <div className="py-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping</h4>
        <div className="flex items-center">
          <input
            id="free-shipping"
            name="freeShipping"
            type="checkbox"
            checked={localFilters.freeShipping === 'true'}
            onChange={(e) => onFilterChange('freeShipping', e.target.checked ? 'true' : '')}
            className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="free-shipping"
            className="ml-3 text-sm text-gray-600"
          >
            Free Shipping
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;