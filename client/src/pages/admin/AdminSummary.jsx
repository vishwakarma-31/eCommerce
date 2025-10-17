import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const AdminSummary = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const completedFeatures = [
    {
      id: 'users',
      title: 'User Management',
      description: 'View all users with search/filter, user details page, suspend/activate user accounts, delete user accounts, view user order history, send email to user',
      pages: ['/admin/users', '/admin/users/:id'],
      status: 'complete'
    },
    {
      id: 'products',
      title: 'Product Management',
      description: 'View all products with filters, add/edit products, bulk product upload (CSV), product approval workflow',
      pages: ['/admin/products', '/admin/products/create'],
      status: 'partial'
    },
    {
      id: 'orders',
      title: 'Order Management',
      description: 'View all orders with filters, update order status (bulk action), assign tracking numbers, print shipping labels, handle returns/refunds, order disputes resolution',
      pages: ['/admin/orders'],
      status: 'partial'
    },
    {
      id: 'categories',
      title: 'Category Management',
      description: 'Create categories & subcategories, reorder categories, upload category images, set featured categories, category analytics',
      pages: ['/admin/categories'],
      status: 'complete'
    },
    {
      id: 'coupons',
      title: 'Coupon Management',
      description: 'Create/edit/delete coupons, set usage limits, set expiry dates, view coupon usage stats, deactivate coupons',
      pages: ['/admin/coupons'],
      status: 'complete'
    },
    {
      id: 'content',
      title: 'Content Management',
      description: 'Homepage banner management, featured products selection, promotional sections, FAQ management, static pages (About, Terms, Privacy)',
      pages: ['/admin/content'],
      status: 'complete'
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Sales reports (daily, weekly, monthly, yearly), product performance reports, user activity reports, revenue reports, export all reports (CSV, PDF)',
      pages: ['/admin/reports'],
      status: 'complete'
    },
    {
      id: 'settings',
      title: 'Site Settings',
      description: 'Manage site configuration, SMTP settings, contact information, social media links, features & permissions',
      pages: ['/admin/settings'],
      status: 'complete'
    },
    {
      id: 'dashboard',
      title: 'Admin Dashboard',
      description: 'Main dashboard with overview statistics, charts, and quick actions',
      pages: ['/admin/dashboard'],
      status: 'complete'
    }
  ];

  const pendingFeatures = [
    {
      id: 'product-bulk-edit',
      title: 'Product Bulk Edit',
      description: 'Bulk edit functionality for products (price, stock, status)',
      status: 'pending'
    },
    {
      id: 'product-metrics',
      title: 'Product Performance Metrics',
      description: 'Implement product performance metrics',
      status: 'pending'
    },
    {
      id: 'low-stock',
      title: 'Low Stock Alerts',
      description: 'Low stock alerts and out of stock management',
      status: 'pending'
    },
    {
      id: 'order-tracking',
      title: 'Order Tracking',
      description: 'Implement order status updates and tracking number assignment',
      status: 'pending'
    },
    {
      id: 'shipping-labels',
      title: 'Shipping Labels',
      description: 'Add shipping label printing functionality',
      status: 'pending'
    },
    {
      id: 'returns-refunds',
      title: 'Returns & Refunds',
      description: 'Implement return/refund handling and dispute resolution',
      status: 'pending'
    },
    {
      id: 'category-analytics',
      title: 'Category Analytics',
      description: 'Add category analytics functionality',
      status: 'pending'
    },
    {
      id: 'coupon-stats',
      title: 'Coupon Statistics',
      description: 'Implement coupon usage limits, expiry dates, and statistics',
      status: 'pending'
    },
    {
      id: 'faq-management',
      title: 'FAQ Management',
      description: 'Add FAQ and static pages management',
      status: 'pending'
    }
  ];

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
            Admin Features Summary
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

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Overview</h3>
        <p className="text-gray-600 mb-4">
          This admin panel provides comprehensive management capabilities for the e-commerce platform. 
          Below is a summary of implemented features and pending items.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-800">Completed Features</h4>
            <p className="mt-1 text-2xl font-bold text-green-900">
              {completedFeatures.filter(f => f.status === 'complete').length}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800">Partially Completed</h4>
            <p className="mt-1 text-2xl font-bold text-yellow-900">
              {completedFeatures.filter(f => f.status === 'partial').length}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800">Pending Features</h4>
            <p className="mt-1 text-2xl font-bold text-blue-900">
              {pendingFeatures.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completed Features */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Completed & Partial Features</h3>
          <div className="space-y-4">
            {completedFeatures.map((feature) => (
              <div 
                key={feature.id} 
                className={`border rounded-lg p-4 ${
                  feature.status === 'complete' 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">{feature.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {feature.pages?.map((page, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {page}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      feature.status === 'complete' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {feature.status === 'complete' ? 'Complete' : 'Partial'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Features */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Features</h3>
          <div className="space-y-4">
            {pendingFeatures.map((feature) => (
              <div 
                key={feature.id} 
                className="border border-blue-200 bg-blue-50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">{feature.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Next Steps</h3>
            <p className="text-gray-600 mb-4">
              To complete all admin features, focus on implementing the pending items listed above. 
              Priority should be given to features that enhance core functionality:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Complete product management with bulk edit and performance metrics</li>
              <li>Implement order tracking and shipping label functionality</li>
              <li>Add low stock alerts and inventory management</li>
              <li>Enhance reporting with category analytics and coupon statistics</li>
              <li>Complete FAQ and static pages management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;