import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import ProductGrid from './ProductGrid';
import Loader from '../common/Loader';

const RelatedProducts = ({ productId, limit = 4 }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        // Use enhanced related products algorithm with options
        const response = await productService.getRelatedProducts(productId, { limit });
        setRelatedProducts(response.data.products || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load related products');
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, limit]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (error || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
      <ProductGrid products={relatedProducts} />
    </section>
  );
};

export default RelatedProducts;