import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import { debounce } from '../../utils/searchUtils';
import searchService from '../../services/searchService';

const SearchBar = ({ onSearch, className = '', showAutocomplete = true }) => {
  const { searchProducts, searchQuery, clearSearch } = useSearch();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocompleteResults, setShowAutocompleteResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popularSearches, setPopularSearches] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const autocompleteRef = useRef(null);

  // Update local query when searchQuery changes
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowAutocompleteResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch popular searches
  useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
        const response = await searchService.getPopularSearches(5);
        setPopularSearches(response.data || []);
      } catch (error) {
        console.error('Failed to fetch popular searches:', error);
      }
    };

    fetchPopularSearches();
  }, []);

  // Debounced search function for autocomplete
  const debouncedAutocompleteSearch = debounce(async (query) => {
    if (query.trim().length < 2) {
      setAutocompleteResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const suggestions = await searchService.getSearchSuggestions(query, 5);
      setAutocompleteResults(suggestions);
    } catch (error) {
      console.error('Autocomplete search failed:', error);
      setAutocompleteResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  // Debounced search function for main search
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
    
    if (showAutocomplete) {
      if (value.trim().length >= 2) {
        setShowAutocompleteResults(true);
        debouncedAutocompleteSearch(value);
      } else {
        setShowAutocompleteResults(false);
        setAutocompleteResults([]);
      }
    }
    
    debouncedSearch(value);
  };

  const handleClear = () => {
    setLocalQuery('');
    clearSearch();
    setAutocompleteResults([]);
    setShowAutocompleteResults(false);
    if (onSearch) onSearch('');
  };

  const handleResultClick = (result) => {
    setLocalQuery(result);
    setShowAutocompleteResults(false);
    
    // Navigate to search results page
    navigate(`/search?q=${encodeURIComponent(result)}`);
  };

  const handlePopularSearchClick = (query) => {
    setLocalQuery(query);
    setShowAutocompleteResults(false);
    
    // Navigate to search results page
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowAutocompleteResults(false);
    if (localQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(localQuery)}`);
    }
  };

  return (
    <div className={`relative ${className}`} ref={autocompleteRef}>
      <form onSubmit={handleFormSubmit}>
        <div className="flex items-center">
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onFocus={() => showAutocomplete && localQuery.trim().length >= 2 && setShowAutocompleteResults(true)}
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-r-lg transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete dropdown */}
      {showAutocomplete && showAutocompleteResults && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          {isLoading ? (
            <div className="px-4 py-3 text-gray-500">Searching...</div>
          ) : autocompleteResults.length > 0 ? (
            <>
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Suggestions
                </div>
                <ul>
                  {autocompleteResults.map((result, index) => (
                    <li
                      key={index}
                      onClick={() => handleResultClick(result)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>{result}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : localQuery.trim().length >= 2 ? (
            <div className="px-4 py-3 text-gray-500">No suggestions found</div>
          ) : null}

          {/* Popular searches */}
          {!isLoading && popularSearches.length > 0 && localQuery.trim().length < 2 && (
            <div className="py-2 border-t border-gray-100">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Popular Searches
              </div>
              <ul>
                {popularSearches.map((search, index) => (
                  <li
                    key={index}
                    onClick={() => handlePopularSearchClick(search.query)}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{search.query}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;