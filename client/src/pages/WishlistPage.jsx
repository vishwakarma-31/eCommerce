import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button';

const WishlistPage = () => {
  const { isAuthenticated } = useAuth();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();

  // In a real implementation, this would fetch actual product data based on wishlist item IDs
  const wishlistProducts = wishlistItems.map(item => ({
    _id: item._id,
    title: `Product ${item._id}`,
    price: 29.99,
    images: [],
    averageRating: 4.5,
    totalReviews: 12
  }));

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your wishlist.</p>
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
            My Wishlist
          </h2>
        </div>
      </div>

      {wishlistProducts.length > 0 ? (
        <ProductGrid products={wishlistProducts} />
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start adding products to your wishlist to save them for later.
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

export default WishlistPage;