import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/common/Button';

const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
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

      {cartItems.length > 0 ? (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.product._id}>
                    <CartItem
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <CartSummary
              subtotal={cartTotal}
              shipping={0}
              tax={0}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default CartPage;