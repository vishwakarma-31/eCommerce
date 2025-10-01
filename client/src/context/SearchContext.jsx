import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import searchService from '../services/searchService';
import { debounce } from '../utils/searchUtils';

// Create the context
const SearchContext = createContext();

// Custom hook to use the search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

// SearchProvider component
export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: null,
    maxPrice: null,
    status: '',
    minRating: null,
    sortBy: 'newest'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  // Memoize the filter parameters to avoid unnecessary re-renders
  const memoizedFilters = useMemo(() => ({ ...filters }), [filters]);

  // Memoize the pagination data
  const memoizedPagination = useMemo(() => ({ ...pagination }), [pagination]);

  // Debounced search function as specified in Section 11 (300ms delay)
  const debouncedSearch = useCallback(
    debounce(async (query, filterParams) => {
      if (!query) {
        setSearchResults([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          query,
          ...filterParams,
          page: 1,
          limit: 12
        };
        
        const response = await searchService.searchProducts(params);
        setSearchResults(response.products);
        setPagination(response.pagination);
      } catch (err) {
        setError(err.message);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Search products
  const searchProducts = useCallback((query, filterParams = {}) => {
    setSearchQuery(query);
    debouncedSearch(query, filterParams);
  }, [debouncedSearch]);

  // Filter products
  const filterProducts = useCallback(async (filterParams) => {
    setFilters(prev => ({ ...prev, ...filterParams }));
    
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        ...filters,
        ...filterParams
      };
      
      const response = await searchService.getProducts(params);
      setFilteredProducts(response.products);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Sort products
  const sortProducts = useCallback(async (sortBy) => {
    await filterProducts({ sortBy });
  }, [filterProducts]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      categories: [],
      minPrice: null,
      maxPrice: null,
      status: '',
      minRating: null,
      sortBy: 'newest'
    });
    setFilteredProducts([]);
  }, []);

  const value = {
    // Search state
    searchResults,
    filteredProducts,
    loading,
    error,
    searchQuery,
    filters: memoizedFilters,
    pagination: memoizedPagination,
    
    // Search functions
    searchProducts,
    filterProducts,
    sortProducts,
    clearSearch,
    resetFilters
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;