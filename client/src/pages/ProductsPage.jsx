import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilter from '../components/product/ProductFilter';
import ProductSort from '../components/product/ProductSort';
import Loader from '../components/common/Loader';
import Pagination from '../components/common/Pagination';

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ sortBy: 'createdAt', sortOrder: 'desc' });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Parse query parameters from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get('page')) || 1;
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const search = searchParams.get('search') || '';

    setFilters({
      category,
      minPrice,
      maxPrice,
      status,
      search
    });

    setSort({
      sortBy,
      sortOrder
    });

    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  }, [location.search]);

  // Fetch products based on filters, sort, and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page: pagination.currentPage,
          limit: 12,
          ...filters,
          ...sort
        };

        const response = await productService.getProducts(params);
        const { products, pagination: paginationData } = response.data;

        setProducts(products || []);
        setPagination(paginationData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, sort, pagination.currentPage]);

  // Update URL when filters or sort change
  useEffect(() => {
    const searchParams = new URLSearchParams();

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value);
      }
    });

    // Add sort
    Object.entries(sort).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value);
      }
    });

    // Add pagination
    if (pagination.currentPage > 1) {
      searchParams.append('page', pagination.currentPage);
    }

    const newUrl = `/products?${searchParams.toString()}`;
    navigate(newUrl, { replace: true });
  }, [filters, sort, pagination.currentPage, navigate]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleCompareProducts = () => {
    // In a real implementation, this would get selected products from context or state
    // For now, we'll just navigate to the comparison page
    navigate('/compare');
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="mt-1 text-gray-600">
            Discover innovative products from creators around the world
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleCompareProducts}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Compare Products
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
            <ProductFilter 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>
        </div>

        {/* Products grid */}
        <div className="lg:w-3/4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.currentPage - 1) * 12 + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * 12, pagination.totalProducts)}
                </span>{' '}
                of <span className="font-medium">{pagination.totalProducts}</span> products
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <ProductSort 
                sort={sort} 
                onSortChange={handleSortChange} 
              />
            </div>
          </div>

          <ProductGrid products={products} loading={loading} />

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination 
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;