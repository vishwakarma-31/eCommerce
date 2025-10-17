import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import LazyImage from '../common/LazyImage';
import RatingStars from '../review/RatingStars';
import Button from '../common/Button';

const ProductQuickView = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const isWishlisted = isInWishlist(product._id);

  const isFunding = product.status === 'Funding';
  const isMarketplace = product.status === 'Marketplace';

  // Set default variant if variants exist
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }

    const productToAdd = {
      ...product,
      selectedVariant: selectedVariant || null
    };

    addToCart(productToAdd, quantity);
    onClose();
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }

    addToWishlist(product);
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const getFinalPrice = () => {
    if (selectedVariant && selectedVariant.discountPrice) {
      return selectedVariant.discountPrice;
    }
    if (selectedVariant && selectedVariant.price) {
      return selectedVariant.price;
    }
    if (product.discountPrice) {
      return product.discountPrice;
    }
    return product.price;
  };

  const isOnSale = () => {
    if (selectedVariant && selectedVariant.discountPrice) {
      return selectedVariant.discountPrice < selectedVariant.price;
    }
    if (product.discountPrice) {
      return product.discountPrice < product.price;
    }
    return false;
  };

  const getDiscountPercentage = () => {
    if (selectedVariant && selectedVariant.discountPrice && selectedVariant.price) {
      return Math.round(((selectedVariant.price - selectedVariant.discountPrice) / selectedVariant.price) * 100);
    }
    if (product.discountPrice && product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  const finalPrice = getFinalPrice();
  const onSale = isOnSale();
  const discountPercentage = getDiscountPercentage();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Images */}
              <div>
                <div className="bg-gray-200 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <LazyImage
                      src={product.images[selectedImageIndex]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">No image available</span>
                  )}
                </div>
                
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageSelect(index)}
                        className={`bg-gray-200 rounded-lg overflow-hidden aspect-square border-2 ${
                          selectedImageIndex === index ? 'border-indigo-500' : 'border-transparent'
                        }`}
                      >
                        <LazyImage
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
                    <div className="mt-1 flex items-center">
                      <RatingStars rating={product.averageRating} />
                      <span className="ml-2 text-gray-600">
                        {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  {onSale && (
                    <div className="flex items-center">
                      <p className="text-2xl font-bold text-gray-900">${finalPrice.toFixed(2)}</p>
                      <span className="ml-2 text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                        {discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                  {!onSale && (
                    <p className="text-2xl font-bold text-gray-900">${finalPrice.toFixed(2)}</p>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-gray-600">{product.shortDescription || product.description}</p>
                </div>

                {/* Product Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Variants</h3>
                    <div className="space-y-2">
                      {product.variants.map((variant, index) => (
                        <div
                          key={index}
                          onClick={() => handleVariantChange(variant)}
                          className={`p-2 border rounded-lg cursor-pointer ${
                            selectedVariant && selectedVariant.sku === variant.sku
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              {variant.size && <span className="font-medium">Size: {variant.size}</span>}
                              {variant.color && (
                                <div className="flex items-center mt-1">
                                  <span className="mr-2">Color:</span>
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: variant.color }}
                                  />
                                  <span className="ml-2">{variant.color}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              {variant.discountPrice && variant.discountPrice < variant.price ? (
                                <div>
                                  <span className="font-medium">${variant.discountPrice.toFixed(2)}</span>
                                  <span className="ml-2 text-gray-500 line-through">${variant.price.toFixed(2)}</span>
                                </div>
                              ) : (
                                <span className="font-medium">${variant.price.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                {isMarketplace && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Quantity</h3>
                    <div className="flex items-center">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 border border-gray-300 rounded-l-md"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-3 py-1 border-t border-b border-gray-300 text-center"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 border border-gray-300 rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1"
                    disabled={!isMarketplace}
                  >
                    {isFunding ? 'Back This Project' : 'Add to Cart'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleAddToWishlist}
                    className="flex-1"
                  >
                    {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>
                </div>

                {/* View Full Details Link */}
                <div className="mt-4 text-center">
                  <Link 
                    to={`/product/${product._id}`} 
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                    onClick={onClose}
                  >
                    View full details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;