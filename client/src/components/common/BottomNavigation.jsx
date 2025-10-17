import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { HomeIcon, ShoppingBagIcon, HeartIcon, UserIcon } from '@heroicons/react/outline';

const BottomNavigation = () => {
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="grid grid-cols-4 gap-1">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-2 px-3 text-xs ${
            isActive('/') 
              ? 'text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <HomeIcon className="h-5 w-5" />
          <span className="mt-1">Home</span>
        </Link>
        
        <Link
          to="/products"
          className={`flex flex-col items-center justify-center py-2 px-3 text-xs ${
            isActive('/products') 
              ? 'text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShoppingBagIcon className="h-5 w-5" />
          <span className="mt-1">Products</span>
        </Link>
        
        <Link
          to="/wishlist"
          className={`flex flex-col items-center justify-center py-2 px-3 text-xs relative ${
            isActive('/wishlist') 
              ? 'text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <HeartIcon className="h-5 w-5" />
          <span className="mt-1">Wishlist</span>
          {/* Wishlist count indicator */}
        </Link>
        
        {isAuthenticated ? (
          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center py-2 px-3 text-xs ${
              isActive('/profile') || location.pathname.startsWith('/profile/')
                ? 'text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserIcon className="h-5 w-5" />
            <span className="mt-1">Profile</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className={`flex flex-col items-center justify-center py-2 px-3 text-xs ${
              isActive('/login') 
                ? 'text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserIcon className="h-5 w-5" />
            <span className="mt-1">Account</span>
          </Link>
        )}
        
        <Link
          to="/cart"
          className={`flex flex-col items-center justify-center py-2 px-3 text-xs relative ${
            isActive('/cart') 
              ? 'text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShoppingBagIcon className="h-5 w-5" />
          <span className="mt-1">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;