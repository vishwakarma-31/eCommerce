import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40">
          <div 
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={toggleMenu}
          ></div>
          
          <div className="relative bg-white h-full w-64 max-w-sm ml-auto overflow-y-auto">
            <div className="pt-5 pb-6">
              <div className="flex items-center justify-between px-4">
                <div>
                  <span className="text-2xl font-bold text-indigo-600">LaunchPad</span>
                  <span className="text-2xl font-bold text-gray-900">Market</span>
                </div>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-6 px-4">
                <nav className="space-y-1">
                  <Link
                    to="/"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                  <Link
                    to="/products"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Products
                  </Link>
                  <Link
                    to="/creators"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Creators
                  </Link>
                  <Link
                    to="/campaigns"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Campaigns
                  </Link>
                  <Link
                    to="/compare"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Compare
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Wishlist
                  </Link>
                </nav>
              </div>
              
              <div className="mt-6 px-4 border-t border-gray-200 pt-6">
                <nav className="space-y-1">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        onClick={toggleMenu}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/profile/orders"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        onClick={toggleMenu}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        onClick={toggleMenu}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        onClick={toggleMenu}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;