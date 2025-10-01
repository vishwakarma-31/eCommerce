import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import { debounce, formatSearchQuery } from '../../utils/searchUtils';

const SearchBar = ({ onSearch, className = '' }) => {
  const { searchProducts, searchQuery, clearSearch } = useSearch();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Update local query when searchQuery changes
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Debounced search function as specified in Section 11 (300ms delay)
  const debouncedSearch = debounce((query) => {
    if (query.trim()) {
      searchProducts(query);
      if (onSearch) onSearch(query);
    } else {
      clearSearch();
      if (onSearch) onSearch('');
    }
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setLocalQuery('');
    clearSearch();
    if (onSearch) onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <input
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          placeholder="Search products..."
          className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {localQuery && (
          <button
            onClick={handleClear}
            className="px-3 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-r-lg transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;