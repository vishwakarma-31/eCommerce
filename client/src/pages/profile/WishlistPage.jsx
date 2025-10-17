import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { userService } from '../../services/userService';

const WishlistPage = () => {
  const { isAuthenticated } = useAuth();
  const { wishlistItems, removeFromWishlist, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [movingToCart, setMovingToCart] = useState(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  const handleMoveToCart = async (productId) => {
    try {
      setMovingToCart(productId);
      
      // Add to cart
      await addToCart(productId, 1);
      
      // Remove from wishlist
      await removeFromWishlist(productId);
      
      // Refresh wishlist
      await fetchWishlist();
    } catch (err) {
      alert('Failed to move item to cart: ' + (err.response?.data?.message || err.message));
    } finally {
      setMovingToCart(null);
    }
  };

  const handleShareWishlist = async () => {
    try {
      setSharing(true);
      const response = await userService.shareWishlist();
      // In a real implementation, you might want to copy the share link to clipboard
      // or open a share dialog
      alert(`Wishlist shared successfully! Share link: ${response.data.shareLink}`);
    } catch (err) {
      alert('Failed to share wishlist: ' + (err.response?.data?.message || err.message));
    } finally {
      setSharing(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      await fetchWishlist();
    } catch (err) {
      alert('Failed to remove item from wishlist: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

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
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button
            variant="outline"
            onClick={handleShareWishlist}
            disabled={sharing || wishlistItems.length === 0}
          >
            {sharing ? 'Sharing...' : 'Share Wishlist'}
          </Button>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items in wishlist</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start adding products to your wishlist.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {wishlistItems.map((item) => (
              <li key={item._id}>
                <div className="px-4 py-6 sm:px-6 flex items-center">
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                    {item.images?.[0] ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-lg font-medium text-gray-900 mt-1">
                        ${item.price?.toFixed(2) || item.discountPrice?.toFixed(2) || '0.00'}
                      </p>
                      <div className="mt-1">
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <svg
                                key={rating}
                                className={`${
                                  item.averageRating > rating ? 'text-yellow-400' : 'text-gray-300'
                                } flex-shrink-0 h-4 w-4`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-sm text-gray-500">
                              {item.averageRating?.toFixed(1) || 0} ({item.totalReviews || 0} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-1">
                        {item.stock > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveToCart(item._id)}
                      disabled={movingToCart === item._id}
                    >
                      {movingToCart === item._id ? 'Moving...' : 'Move to Cart'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProduct(item._id)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFromWishlist(item._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;