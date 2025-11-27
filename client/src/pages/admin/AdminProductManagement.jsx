import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import adminService from '../../services/adminService';

const AdminProductManagement = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    if (isAuthenticated && currentUser && currentUser.role === 'Admin') {
      fetchProducts();
    }
  }, [isAuthenticated, currentUser, currentPage, searchTerm, statusFilter, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
        category: categoryFilter
      };

      const data = await adminService.getProducts(params);
      setProducts(data.products);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCategoryFilter('');
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product._id));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction) {
      alert('Please select a bulk action');
      return;
    }

    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    try {
      // For now, we'll just show an alert with the action that would be performed
      // In a real implementation, you would call the appropriate API endpoints
      alert(`Bulk action "${bulkAction}" would be performed on ${selectedProducts.length} products`);
      
      // Reset selections after action
      setSelectedProducts([]);
      setBulkAction('');
      
      // Refresh the product list
      fetchProducts();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Failed to perform bulk action');
    }
  };

  const handleApproveProduct = async (productId) => {
    try {
      await adminService.approveProduct(productId);
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error approving product:', error);
      alert('Failed to approve product');
    }
  };

  const handleRejectProduct = async (productId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      try {
        await adminService.rejectProduct(productId, { reason });
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error('Error rejecting product:', error);
        alert('Failed to reject product');
      }
    }
  };

  const handleFeatureProduct = async (productId) => {
    try {
      await adminService.featureProduct(productId);
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error featuring product:', error);
      alert('Failed to feature product');
    }
  };

  const handleUnfeatureProduct = async (productId) => {
    try {
      await adminService.unfeatureProduct(productId);
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error unfeaturing product:', error);
      alert('Failed to unfeature product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await adminService.deleteProduct(productId);
        fetchProducts(); // Refresh the list
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view the admin dashboard.</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (currentUser?.role !== 'Admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access denied</h2>
          <p className="text-gray-600 mb-6">You must be an administrator to access this page.</p>
          <Button onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Products Management
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Button
            onClick={() => navigate('/admin/dashboard')}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by title or description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="Funding">Funding</option>
              <option value="Successful">Successful</option>
              <option value="Failed">Failed</option>
              <option value="InProduction">In Production</option>
              <option value="Marketplace">Marketplace</option>
              <option value="OutOfStock">Out of Stock</option>
              <option value="Discontinued">Discontinued</option>
              <option value="Pending">Pending Approval</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Fashion">Fashion</option>
              <option value="Toys & Games">Toys & Games</option>
              <option value="Sports & Outdoors">Sports & Outdoors</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Books & Media">Books & Media</option>
              <option value="Automotive">Automotive</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Art & Crafts">Art & Crafts</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {selectedProducts.length} product(s) selected
              </p>
            </div>
            <div className="ml-auto flex space-x-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select action</option>
                <option value="approve">Approve</option>
                <option value="reject">Reject</option>
                <option value="feature">Feature</option>
                <option value="unfeature">Unfeature</option>
                <option value="delete">Delete</option>
              </select>
              <Button
                onClick={handleBulkAction}
                variant="primary"
                size="sm"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creator
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className={selectedProducts.includes(product._id) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.images && product.images.length > 0 ? (
                            <img className="h-10 w-10 rounded-md" src={product.images[0]} alt={product.title} />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.creator?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{product.creator?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        product.status === 'Funding' ? 'bg-blue-100 text-blue-800' :
                        product.status === 'Successful' ? 'bg-green-100 text-green-800' :
                        product.status === 'Failed' ? 'bg-red-100 text-red-800' :
                        product.status === 'InProduction' ? 'bg-purple-100 text-purple-800' :
                        product.status === 'Marketplace' ? 'bg-indigo-100 text-indigo-800' :
                        product.status === 'OutOfStock' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.price?.toFixed(2) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.inventory?.quantity !== undefined ? product.inventory.quantity : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => navigate(`/product/${product._id}`)}
                          variant="outline"
                          size="sm"
                        >
                          View
                        </Button>
                        {product.status === 'Pending' && (
                          <>
                            <Button
                              onClick={() => handleApproveProduct(product._id)}
                              variant="success"
                              size="sm"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectProduct(product._id)}
                              variant="danger"
                              size="sm"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {product.isFeatured ? (
                          <Button
                            onClick={() => handleUnfeatureProduct(product._id)}
                            variant="warning"
                            size="sm"
                          >
                            Unfeature
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleFeatureProduct(product._id)}
                            variant="primary"
                            size="sm"
                          >
                            Feature
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteProduct(product._id)}
                          variant="danger"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductManagement;