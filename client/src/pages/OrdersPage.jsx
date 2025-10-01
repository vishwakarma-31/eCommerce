import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const OrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check for success message from checkout
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
    
    // In a real implementation, this would fetch orders from an API
    const fetchOrders = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setOrders([
            {
              _id: '1',
              orderNumber: 'LP-2025-001',
              date: '2025-09-15',
              total: 89.97,
              status: 'Delivered',
              items: [
                { name: 'Wireless Headphones', quantity: 1, price: 59.99 },
                { name: 'Phone Charger', quantity: 2, price: 14.99 }
              ]
            },
            {
              _id: '2',
              orderNumber: 'LP-2025-002',
              date: '2025-09-22',
              total: 129.99,
              status: 'Shipped',
              items: [
                { name: 'Smart Watch', quantity: 1, price: 129.99 }
              ]
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, location.state?.message]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your orders.</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
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
            My Orders
          </h2>
        </div>
      </div>

      {message && (
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <div className="text-sm text-green-700">
            {message}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : orders.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order._id}>
                <div className="px-4 py-6 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600">
                      Order #{order.orderNumber}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="text-sm text-gray-500">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-lg font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/order/${order._id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            When you place an order, it will appear here.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;