import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';

const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const { cart, cartTotal, updateQuantity, removeFromCart, applyCoupon, loading, error } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    try {
      setCouponError('');
      setCouponSuccess('');
      await applyCoupon(couponCode);
      setCouponSuccess('Coupon applied successfully!');
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message || 'Failed to apply coupon');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
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
            Shopping Cart
          </h2>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <p>Loading cart...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {cart?.items?.length > 0 ? (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow">
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <li key={item._id} className="p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
                        )}
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              <a href={`/product/${item.product._id}`}>{item.product.name}</a>
                            </h3>
                            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          {item.variant && (
                            <div className="mt-1 text-sm text-gray-500">
                              {item.variant.size && <span>Size: {item.variant.size}</span>}
                              {item.variant.color && <span className="ml-2">Color: {item.variant.color}</span>}
                            </div>
                          )}
                          <p className="mt-1 text-sm text-gray-500">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        
                        <div className="flex items-center mt-2">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              disabled={loading}
                            >
                              -
                            </button>
                            <span className="px-3 py-1">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              disabled={loading}
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                            disabled={loading}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
              
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-600">Subtotal</dt>
                  <dd className="text-base font-medium text-gray-900">${cartTotal.toFixed(2)}</dd>
                </div>
              </dl>
              
              <form onSubmit={handleApplyCoupon} className="mt-6">
                <label htmlFor="coupon-code" className="block text-sm font-medium text-gray-700">
                  Coupon Code
                </label>
                <div className="mt-1 flex">
                  <input
                    type="text"
                    id="coupon-code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter coupon code"
                  />
                  <button
                    type="submit"
                    className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading || !couponCode.trim()}
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="mt-2 text-sm text-red-600">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="mt-2 text-sm text-green-600">{couponSuccess}</p>
                )}
              </form>
              
              <div className="mt-6">
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  disabled={loading}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start adding some products to your cart!
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/products')}>
                Browse Products
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CartPage;