import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const AdminDashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch data from an API
    const fetchData = async () => {
      try {
        // Simulate API calls
        setTimeout(() => {
          setStats({
            totalUsers: 1242,
            totalProducts: 86,
            totalOrders: 352,
            totalRevenue: 24567
          });
          
          setPendingProducts([
            {
              _id: '1',
              title: 'Smart Fitness Tracker',
              creator: { name: 'Alex Johnson' },
              createdAt: '2025-09-28'
            },
            {
              _id: '2',
              title: 'Wireless Noise Cancelling Headphones',
              creator: { name: 'Sarah Williams' },
              createdAt: '2025-09-29'
            },
            {
              _id: '3',
              title: 'Portable Espresso Maker',
              creator: { name: 'Michael Chen' },
              createdAt: '2025-09-30'
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated && currentUser && currentUser.role === 'Admin') {
      fetchData();
    }
  }, [isAuthenticated, currentUser]);

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
          <p className="text-gray-600 mb-6">You must be an administrator to access this dashboard.</p>
          <Button onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Admin Dashboard
          </h2>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalOrders.toLocaleString()}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">${stats.totalRevenue.toLocaleString()}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Products */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Product Approvals</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin/products')}
            >
              View All
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-200">
          {pendingProducts.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {pendingProducts.map((product) => (
                <li key={product._id}>
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{product.title}</h4>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>by {product.creator.name}</span>
                          <span className="mx-2">•</span>
                          <span>Submitted {new Date(product.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/products/${product._id}/review`)}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-12 sm:px-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pending products</h3>
              <p className="mt-1 text-sm text-gray-500">
                All products are approved and up to date.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="px-6 py-8 text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Manage Users</h3>
              <p className="mt-2 text-sm text-gray-500">
                View, suspend, or delete user accounts
              </p>
            </button>
            
            <button
              onClick={() => navigate('/admin/products')}
              className="px-6 py-8 text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Manage Products</h3>
              <p className="mt-2 text-sm text-gray-500">
                Approve, edit, or remove products
              </p>
            </button>
            
            <button
              onClick={() => navigate('/admin/orders')}
              className="px-6 py-8 text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Manage Orders</h3>
              <p className="mt-2 text-sm text-gray-500">
                View and manage customer orders
              </p>
            </button>
            
            <button
              onClick={() => navigate('/admin/categories')}
              className="px-6 py-8 text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Manage Categories</h3>
              <p className="mt-2 text-sm text-gray-500">
                Add, edit, or remove product categories
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;