import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import productService from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useComparison } from '../context/ComparisonContext';
import { toast } from 'react-toastify';
import LazyImage from '../components/common/LazyImage';
import ProductQA from '../components/product/ProductQ&A';
import ProductReviews from '../components/product/ProductReviews';
import RelatedProducts from '../components/product/RelatedProducts';
import StickyAddToCart from '../components/product/StickyAddToCart';
import SwipeableImageGallery from '../components/product/SwipeableImageGallery';
import { generateProductSEO, generateProductStructuredData } from '../services/seoService';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { comparedProducts, addToComparison, removeFromComparison } = useComparison();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
        
        // Set default variant if available
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        
        // Add to recently viewed
        addToRecentlyViewed(data);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, addToRecentlyViewed]);

  // Add product to wishlist
  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    if (wishlist.some(item => item._id === product._id)) {
      removeFromWishlist(product._id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  // Add product to comparison
  const handleComparisonToggle = () => {
    if (comparedProducts.some(item => item._id === product._id)) {
      removeFromComparison(product._id);
      toast.info('Removed from comparison');
    } else {
      if (comparedProducts.length >= 4) {
        toast.error('You can only compare up to 4 products');
        return;
      }
      addToComparison(product);
      toast.success('Added to comparison');
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    const itemToAdd = {
      product: {
        ...product,
        selectedVariant: selectedVariant || null
      },
      quantity
    };
    
    addToCart(itemToAdd);
    toast.success('Added to cart');
  };

  // Handle variant selection
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Generate SEO data
  const seoData = generateProductSEO(product);
  const structuredData = generateProductStructuredData(product);

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.og.title} />
        <meta property="og:description" content={seoData.og.description} />
        <meta property="og:type" content={seoData.og.type} />
        <meta property="og:url" content={seoData.og.url} />
        <meta property="og:image" content={seoData.og.image} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={seoData.twitter.card} />
        <meta name="twitter:title" content={seoData.twitter.title} />
        <meta name="twitter:description" content={seoData.twitter.description} />
        <meta name="twitter:image" content={seoData.twitter.image} />
        
        {/* Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <SwipeableImageGallery 
              images={product.images} 
              title={product.title}
            />
          </div>
          
          {/* Product Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-gray-600 mb-4">{product.shortDescription}</p>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <svg
                      key={rating}
                      className={`h-5 w-5 ${product.averageRating && rating < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.averageRating ? product.averageRating.toFixed(1) : 'No ratings'} 
                  {product.reviewCount ? ` (${product.reviewCount} reviews)` : ''}
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                {product.discountPrice && product.discountPrice < product.price ? (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-gray-900">${product.discountPrice.toFixed(2)}</span>
                    <span className="ml-2 text-xl text-gray-500 line-through">${product.price.toFixed(2)}</span>
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                )}
              </div>
            </div>
            
            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Options</h3>
                <div className="space-y-4">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div>
                        <div className="font-medium">{variant.size} - {variant.color} - {variant.material}</div>
                        <div className="text-sm text-gray-500">
                          {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleVariantSelect(variant)}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                          selectedVariant === variant
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {selectedVariant === variant ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity and Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3 mb-8">
              <button
                onClick={handleWishlistToggle}
                className={`flex-1 py-2 px-4 border rounded-md flex items-center justify-center ${
                  wishlist.some(item => item._id === product._id)
                    ? 'border-red-500 text-red-500'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg
                  className={`h-5 w-5 mr-2 ${wishlist.some(item => item._id === product._id) ? 'fill-current' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlist.some(item => item._id === product._id) ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
              
              <button
                onClick={handleComparisonToggle}
                className={`flex-1 py-2 px-4 border rounded-md flex items-center justify-center ${
                  comparedProducts.some(item => item._id === product._id)
                    ? 'border-indigo-500 text-indigo-500'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {comparedProducts.some(item => item._id === product._id) ? 'In Comparison' : 'Compare'}
              </button>
            </div>
            
            {/* Product Meta */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Category:</span>
                  <span className="ml-2 text-gray-600">{product.category?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Brand:</span>
                  <span className="ml-2 text-gray-600">{product.brand || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">SKU:</span>
                  <span className="ml-2 text-gray-600">{product.sku || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Availability:</span>
                  <span className={`ml-2 ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'description'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'specifications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews ({product.reviewCount || 0})
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'qa'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Q&A
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                <dl className="space-y-3">
                  <div className="flex">
                    <dt className="w-1/3 text-sm font-medium text-gray-500">Brand</dt>
                    <dd className="w-2/3 text-sm text-gray-900">{product.brand || 'N/A'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 text-sm font-medium text-gray-500">Category</dt>
                    <dd className="w-2/3 text-sm text-gray-900">{product.category?.name || 'N/A'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 text-sm font-medium text-gray-500">SKU</dt>
                    <dd className="w-2/3 text-sm text-gray-900">{product.sku || 'N/A'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 text-sm font-medium text-gray-500">Weight</dt>
                    <dd className="w-2/3 text-sm text-gray-900">{product.weight || 'N/A'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 text-sm font-medium text-gray-500">Dimensions</dt>
                    <dd className="w-2/3 text-sm text-gray-900">
                      {product.dimensions ? `${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height}` : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features && product.features.length > 0 ? (
                    product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No features available</li>
                  )}
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <ProductReviews productId={product._id} />
          )}
          
          {activeTab === 'qa' && (
            <ProductQA productId={product._id} />
          )}
        </div>
        
        {/* Related Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <RelatedProducts productId={product._id} />
        </div>
      </div>
      
      {/* Sticky Add to Cart for Mobile */}
      <StickyAddToCart 
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
        onAddToCart={handleAddToCart}
        onQuantityChange={setQuantity}
      />
    </>
  );
};

export default ProductDetailPage;