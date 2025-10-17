import React, { useState, useEffect, useCallback } from 'react';

/**
 * Debounced Search Input Component
 * Delays search requests to reduce API calls
 */
const DebouncedSearchInput = ({ 
  initialValue = '', 
  onSearch, 
  delay = 300,
  placeholder = 'Search...',
  className = '',
  ...props 
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Debounced search function
  const debouncedSearch = useCallback(
    (value) => {
      const handler = setTimeout(() => {
        onSearch(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [onSearch, delay]
  );

  // Trigger search when searchTerm changes
  useEffect(() => {
    if (searchTerm !== undefined) {
      return debouncedSearch(searchTerm);
    }
  }, [searchTerm, debouncedSearch]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        {...props}
      />
      
      {/* Search icon */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      {/* Clear button */}
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default DebouncedSearchInput;