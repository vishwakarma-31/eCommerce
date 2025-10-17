import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { adminService } from '../../services/adminService';

const AdminContentManagement = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Banner management
  const [banners, setBanners] = useState([]);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    isActive: true,
    sortOrder: 0
  });
  
  // Featured products
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    if (isAuthenticated && currentUser && currentUser.role === 'Admin') {
      fetchContentData();
    }
  }, [isAuthenticated, currentUser]);

  const fetchContentData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, you would fetch this data from your API
      // For now, we'll use mock data to demonstrate the UI
      setBanners([
        {
          id: 1,
          title: 'Summer Sale',
          subtitle: 'Up to 50% off on selected items',
          imageUrl: 'https://via.placeholder.com/1200x400?text=Summer+Sale',
          linkUrl: '/products',
          isActive: true,
          sortOrder: 1
        },
        {
          id: 2,
          title: 'New Arrivals',
          subtitle: 'Check out our latest products',
          imageUrl: 'https://via.placeholder.com/1200x400?text=New+Arrivals',
          linkUrl: '/products',
          isActive: true,
          sortOrder: 2
        }
      ]);
      
      setFeaturedProducts([
        {
          id: 101,
          name: 'Wireless Headphones',
          category: 'Electronics',
          price: 99.99,
          imageUrl: 'https://via.placeholder.com/300x300?text=Headphones'
        },
        {
          id: 102,
          name: 'Smart Watch',
          category: 'Electronics',
          price: 199.99,
          imageUrl: 'https://via.placeholder.com/300x300?text=Smart+Watch'
        }
      ]);
      
      setAvailableProducts([
        {
          id: 103,
          name: 'Bluetooth Speaker',
          category: 'Electronics',
          price: 79.99
        },
        {
          id: 104,
          name: 'Gaming Mouse',
          category: 'Electronics',
          price: 49.99
        },
        {
          id: 105,
          name: 'Mechanical Keyboard',
          category: 'Electronics',
          price: 129.99
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching content data:', error);
      setError('Failed to load content data');
    } finally {
      setLoading(false);
    }
  };

  const handleBannerInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBannerForm({
      ...bannerForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setSuccess('');
      setError('');
      
      // In a real implementation, you would save this to your API
      if (editingBanner) {
        // Update existing banner
        setBanners(banners.map(banner => 
          banner.id === editingBanner.id 
            ? { ...banner, ...bannerForm } 
            : banner
        ));
      } else {
        // Add new banner
        const newBanner = {
          ...bannerForm,
          id: Date.now(), // In a real app, this would come from the server
          sortOrder: banners.length + 1
        };
        setBanners([...banners, newBanner]);
      }
      
      // Reset form
      setBannerForm({
        title: '',
        subtitle: '',
        imageUrl: '',
        linkUrl: '',
        isActive: true,
        sortOrder: 0
      });
      setShowBannerForm(false);
      setEditingBanner(null);
      setSuccess('Banner saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error saving banner:', error);
      setError('Failed to save banner: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      isActive: banner.isActive,
      sortOrder: banner.sortOrder
    });
    setShowBannerForm(true);
  };

  const handleDeleteBanner = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        // In a real implementation, you would delete this from your API
        setBanners(banners.filter(banner => banner.id !== bannerId));
        setSuccess('Banner deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (error) {
        console.error('Error deleting banner:', error);
        setError('Failed to delete banner');
      }
    }
  };

  const handleAddFeaturedProduct = async () => {
    if (!selectedProduct) {
      setError('Please select a product to feature');
      return;
    }
    
    try {
      // In a real implementation, you would save this to your API
      const productToAdd = availableProducts.find(p => p.id === parseInt(selectedProduct));
      if (productToAdd) {
        setFeaturedProducts([...featuredProducts, { ...productToAdd }]);
        setSelectedProduct('');
        setSuccess('Product added to featured list');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding featured product:', error);
      setError('Failed to add featured product');
    }
  };

  const handleRemoveFeaturedProduct = async (productId) => {
    try {
      // In a real implementation, you would update this in your API
      setFeaturedProducts(featuredProducts.filter(product => product.id !== productId));
      setSuccess('Product removed from featured list');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error removing featured product:', error);
      setError('Failed to remove featured product');
    }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Content Management
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button
            onClick={() => navigate('/admin/dashboard')}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Banner Management */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Homepage Banners</h3>
            <Button
              onClick={() => {
                setShowBannerForm(!showBannerForm);
                setEditingBanner(null);
                setBannerForm({
                  title: '',
                  subtitle: '',
                  imageUrl: '',
                  linkUrl: '',
                  isActive: true,
                  sortOrder: 0
                });
              }}
              variant="primary"
            >
              {showBannerForm ? 'Cancel' : 'Add Banner'}
            </Button>
          </div>
          
          {showBannerForm && (
            <form onSubmit={handleBannerSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={bannerForm.title}
                    onChange={handleBannerInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    value={bannerForm.subtitle}
                    onChange={handleBannerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={bannerForm.imageUrl}
                    onChange={handleBannerInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Link URL
                  </label>
                  <input
                    type="url"
                    id="linkUrl"
                    name="linkUrl"
                    value={bannerForm.linkUrl}
                    onChange={handleBannerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={bannerForm.isActive}
                    onChange={handleBannerInputChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
                
                <div>
                  <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    id="sortOrder"
                    name="sortOrder"
                    value={bannerForm.sortOrder}
                    onChange={handleBannerInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowBannerForm(false);
                      setEditingBanner(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Banner'}
                  </Button>
                </div>
              </div>
            </form>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader />
            </div>
          ) : (
            <div className="space-y-4">
              {banners.length > 0 ? (
                banners.map((banner) => (
                  <div key={banner.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                        {banner.imageUrl ? (
                          <img 
                            src={banner.imageUrl} 
                            alt={banner.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-md font-medium text-gray-900">{banner.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{banner.subtitle}</p>
                        <div className="mt-2 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            Order: {banner.sortOrder}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBanner(banner)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteBanner(banner.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No banners</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding a new banner.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Featured Products */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Featured Products</h3>
          </div>
          
          <div className="mb-6">
            <div className="flex space-x-2">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a product to feature</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price.toFixed(2)}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleAddFeaturedProduct}
                disabled={!selectedProduct}
              >
                Add
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader />
            </div>
          ) : (
            <div className="space-y-4">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-md font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.category}</p>
                        <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveFeaturedProduct(product.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No featured products</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add products to feature them on the homepage.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* FAQ and Static Pages Management */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">FAQ & Static Pages</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-2">FAQ Management</h4>
            <p className="text-sm text-gray-500 mb-3">
              Manage frequently asked questions and categories.
            </p>
            <Button
              variant="outline"
              onClick={() => alert('FAQ management would be implemented here')}
            >
              Manage FAQ
            </Button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-2">About Page</h4>
            <p className="text-sm text-gray-500 mb-3">
              Edit the company about page content.
            </p>
            <Button
              variant="outline"
              onClick={() => alert('About page editor would be implemented here')}
            >
              Edit Page
            </Button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-2">Terms & Privacy</h4>
            <p className="text-sm text-gray-500 mb-3">
              Update terms of service and privacy policy.
            </p>
            <Button
              variant="outline"
              onClick={() => alert('Terms & Privacy editor would be implemented here')}
            >
              Edit Pages
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContentManagement;