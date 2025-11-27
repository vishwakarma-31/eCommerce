import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useComparison } from '../../context/ComparisonContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { comparisonItems } = useComparison();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 gap-1">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-2 px-3 text-xs ${
            isActive('/') 
              ? 'text-indigo-600 bg-indigo-50' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="mt-1">Home</span>
        </Link>

        <Link
          to="/products"
          className={`flex flex-col items-center justify-center py-2 px-3 text-xs ${
            isActive('/products') 
              ? 'text-indigo-600 bg-indigo-50' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="mt-1">Products</span>
        </Link>

        <Link
          to="/compare"
          className={`flex flex-col items-center justify-center py-2 px-3 text-xs relative ${
            isActive('/compare') 
              ? 'text-indigo-600 bg-indigo-50' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="mt-1">Compare</span>
          {comparisonItems.length > 0 && (
            <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
              {comparisonItems.length}
            </span>
          )}
        </Link>

        <Link
          to="/wishlist"
          className={`flex flex-col items-center justify-center py-2 px-3 text-xs relative ${
            isActive('/wishlist') 
              ? 'text-indigo-600 bg-indigo-50' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="mt-1">Wishlist</span>
          {wishlistCount > 0 && (
            <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
              {wishlistCount}
            </span>
          )}
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center py-2 px-3 text-xs ${
            isActive('/profile') 
              ? 'text-indigo-600 bg-indigo-50' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;