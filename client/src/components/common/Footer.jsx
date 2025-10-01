import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary-main to-primary-light text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 bg-primary-gradient bg-clip-text text-transparent">LaunchPad Market</h3>
            <p className="text-gray-100">
              Revolutionizing e-commerce with community-driven product validation.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">For Creators</h3>
            <ul className="space-y-2">
              <li><Link to="/creator/dashboard" className="text-gray-200 hover:text-white transition-colors duration-300">Dashboard</Link></li>
              <li><Link to="/creator/products/new" className="text-gray-200 hover:text-white transition-colors duration-300">Create Product</Link></li>
              <li><Link to="/creator/analytics" className="text-gray-200 hover:text-white transition-colors duration-300">Analytics</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">For Buyers</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-200 hover:text-white transition-colors duration-300">Browse Products</Link></li>
              <li><Link to="/wishlist" className="text-gray-200 hover:text-white transition-colors duration-300">Wishlist</Link></li>
              <li><Link to="/orders" className="text-gray-200 hover:text-white transition-colors duration-300">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/legal" className="text-gray-200 hover:text-white transition-colors duration-300">All Legal Documents</Link></li>
              <li><a href="/terms-of-service.html" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors duration-300">Terms of Service</a></li>
              <li><a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="/refund-policy.html" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors duration-300">Refund Policy</a></li>
              <li><a href="/creator-agreement.html" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors duration-300">Creator Agreement</a></li>
              <li><a href="/backer-agreement.html" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors duration-300">Backer Agreement</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-dark pt-8 text-center text-gray-200">
          <p>&copy; 2025 LaunchPad Market. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;