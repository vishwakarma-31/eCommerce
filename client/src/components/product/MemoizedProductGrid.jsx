import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ResponsiveImage from '../common/ResponsiveImage';

/**
 * Memoized Product Card Component
 * Prevents unnecessary re-renders with React.memo
 */
const ProductCard = memo(({ product }) => {
  // Memoize product data to prevent unnecessary re-renders
  const productData = useMemo(() => ({
    id: product._id,
    title: product.title,
    price: product.price,
    discountPrice: product.discountPrice,
    images: product.images,
    averageRating: product.averageRating,
    totalReviews: product.totalReviews,
    isOnSale: product.isOnSale,
    isFreeShipping: product.isFreeShipping,
    isNewArrival: product.isNewArrival,
    isBestSeller: product.isBestSeller
  }), [product]);

  // Calculate discount percentage
  const discountPercentage = useMemo(() => {
    if (productData.discountPrice && productData.price) {
      return Math.round(((productData.price - productData.discountPrice) / productData.price) * 100);
    }
    return 0;
  }, [productData.discountPrice, productData.price]);

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${productData.id}`} className="block">
        <div className="relative">
          {productData.images && productData.images.length > 0 ? (
            <ResponsiveImage
              src={productData.images[0]}
              alt={productData.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {productData.isNewArrival && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </span>
            )}
            {productData.isBestSeller && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                BEST
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
          
          {productData.isFreeShipping && (
            <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
              FREE SHIPPING
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {productData.title}
          </h3>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(productData.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-500 ml-1">
                ({productData.totalReviews})
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              {productData.discountPrice && productData.discountPrice < productData.price ? (
                <>
                  <span className="text-lg font-bold text-gray-900">
                    ${productData.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ${productData.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  ${productData.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
});

/**
 * Memoized Product Grid Component
 * Efficiently renders product grids with memoization
 */
const MemoizedProductGrid = ({ products = [], columns = 4 }) => {
  // Memoize grid configuration
  const gridConfig = useMemo(() => ({
    gridCols: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns}`
  }), [columns]);

  return (
    <div className={`grid ${gridConfig.gridCols} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default MemoizedProductGrid;