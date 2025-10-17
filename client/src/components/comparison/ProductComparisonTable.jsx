import React from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../common/LazyImage';
import RatingStars from '../review/RatingStars';

const ProductComparisonTable = ({ products, onRemove }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products to compare</p>
      </div>
    );
  }

  // Helper function to get product price (considering variants and discounts)
  const getProductPrice = (product) => {
    if (product.selectedVariant) {
      if (product.selectedVariant.discountPrice) {
        return product.selectedVariant.discountPrice;
      }
      return product.selectedVariant.price;
    }
    
    if (product.discountPrice) {
      return product.discountPrice;
    }
    
    return product.price;
  };

  // Helper function to check if product is on sale
  const isOnSale = (product) => {
    if (product.selectedVariant) {
      return product.selectedVariant.discountPrice && product.selectedVariant.discountPrice < product.selectedVariant.price;
    }
    return product.discountPrice && product.discountPrice < product.price;
  };

  // Helper function to get discount percentage
  const getDiscountPercentage = (product) => {
    if (product.selectedVariant && product.selectedVariant.discountPrice && product.selectedVariant.price) {
      return Math.round(((product.selectedVariant.price - product.selectedVariant.discountPrice) / product.selectedVariant.price) * 100);
    }
    if (product.discountPrice && product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
              Product
            </th>
            {products.map((product) => (
              <th key={product._id} className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider relative w-1/4">
                <button
                  onClick={() => onRemove(product._id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  aria-label="Remove product"
                >
                  ✕
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Image row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Image
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center">
                  <Link to={`/product/${product._id}`} className="block">
                    <div className="bg-gray-200 rounded-lg overflow-hidden w-32 h-32 flex items-center justify-center">
                      {product.images && product.images.length > 0 ? (
                        <LazyImage
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">No image</span>
                      )}
                    </div>
                  </Link>
                </div>
              </td>
            ))}
          </tr>

          {/* Name row */}
          <tr className="bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Name
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-center">
                <Link to={`/product/${product._id}`} className="text-indigo-600 hover:text-indigo-500 font-medium">
                  {product.title}
                </Link>
              </td>
            ))}
          </tr>

          {/* Price row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Price
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex flex-col items-center">
                  {isOnSale(product) ? (
                    <>
                      <span className="text-lg font-bold text-gray-900">${getProductPrice(product).toFixed(2)}</span>
                      <span className="text-sm text-gray-500 line-through">${product.selectedVariant ? product.selectedVariant.price : product.price}</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded mt-1">
                        {getDiscountPercentage(product)}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">${getProductPrice(product).toFixed(2)}</span>
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* Rating row */}
          <tr className="bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Rating
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex flex-col items-center">
                  <RatingStars rating={product.averageRating} />
                  <span className="text-sm text-gray-600 mt-1">
                    {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
                  </span>
                </div>
              </td>
            ))}
          </tr>

          {/* Category row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Category
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {product.category}
              </td>
            ))}
          </tr>

          {/* Brand row */}
          <tr className="bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Brand
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {product.brand || 'N/A'}
              </td>
            ))}
          </tr>

          {/* Stock Status row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Stock Status
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' :
                  product.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {product.stockStatus}
                </span>
              </td>
            ))}
          </tr>

          {/* Specifications row */}
          <tr className="bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 align-top">
              Specifications
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 text-sm text-gray-500">
                {product.specifications && product.specifications.length > 0 ? (
                  <ul className="space-y-1">
                    {product.specifications.slice(0, 3).map((spec, index) => (
                      <li key={index} className="text-left">
                        <span className="font-medium">{spec.key}:</span> {spec.value}
                      </li>
                    ))}
                    {product.specifications.length > 3 && (
                      <li className="text-left text-indigo-600">
                        +{product.specifications.length - 3} more
                      </li>
                    )}
                  </ul>
                ) : (
                  <span>N/A</span>
                )}
              </td>
            ))}
          </tr>

          {/* Action row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Actions
            </td>
            {products.map((product) => (
              <td key={product._id} className="px-6 py-4 whitespace-nowrap text-center">
                <Link
                  to={`/product/${product._id}`}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Details
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductComparisonTable;