import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const CreatorDashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalRevenue: 0,
    totalBackers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch data from an API
    const fetchData = async () => {
      try {
        // Simulate API calls
        setTimeout(() => {
          setStats({
            totalProjects: 5,
            totalRevenue: 12500,
            totalBackers: 342
          });
          
          setProjects([
            {
              _id: '1',
              title: 'Smart Fitness Tracker',
              status: 'Funding',
              currentFunding: 85,
              fundingGoal: 100,
              deadline: '2025-10-15',
              price: 79.99
            },
            {
              _id: '2',
              title: 'Wireless Noise Cancelling Headphones',
              status: 'Successful',
              currentFunding: 250,
              fundingGoal: 150,
              deadline: '2025-09-30',
              price: 199.99
            },
            {
              _id: '3',
              title: 'Portable Espresso Maker',
              status: 'Marketplace',
              stockQuantity: 42,
              soldQuantity: 158,
              price: 89.99
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated && currentUser && currentUser.role === 'Creator') {
      fetchData();
    }
  }, [isAuthenticated, currentUser]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view the creator dashboard.</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (currentUser?.role !== 'Creator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access denied</h2>
          <p className="text-gray-600 mb-6">You must be a creator to access this dashboard.</p>
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
            Creator Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button
            onClick={() => navigate('/creator/products/new')}
          >
            Create New Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</div>
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

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Backers</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalBackers}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Projects</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/creator/products')}
            >
              View All
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li key={project._id}>
                <div className="px-4 py-6 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{project.title}</h4>
                      <div className="mt-1 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'Funding' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'Successful' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {project.status}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          ${project.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/creator/products/${project._id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/product/${project._id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                  
                  {project.status === 'Funding' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>{project.currentFunding} of {project.fundingGoal} backers</span>
                        <span>
                          {Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (project.currentFunding / project.fundingGoal) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {project.status === 'Marketplace' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Sold: {project.soldQuantity}</span>
                        <span>In Stock: {project.stockQuantity}</span>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;