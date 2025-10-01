import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch the order from an API
    const fetchOrder = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // This is a mock order - in a real app, this would come from an API
          const mockOrder = {
            _id: id,
            orderNumber: 'LP-2025-001',
            date: '2025-09-15',
            total: 89.97,
            status: 'Delivered',
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'United States'
            },
            items: [
              {
                _id: '1',
                name: 'Wireless Headphones',
                quantity: 1,
                price: 59.99,
                image: null
              },
              {
                _id: '2',
                name: 'Phone Charger',
                quantity: 2,
                price: 14.99,
                image: null
              }
            ]
          };
          setOrder(mockOrder);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching order:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [id, user]);

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
          <p className="text-gray-600 mb-6">You need to be logged in to view order details.</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
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

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/orders')}
        >
          ← Back to orders
        </Button>
      </div>

      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Order #{order.orderNumber}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order details</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Order information and items.</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Order number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">#{order.orderNumber}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Date placed</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(order.date).toLocaleDateString()}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Total amount</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${order.total.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Items</h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item._id} className="px-4 py-6 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Shipping information</h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="text-sm text-gray-500">
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order summary</h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${(order.total - 5.99 - 7.20).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">$5.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium">$7.20</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-gray-900">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;