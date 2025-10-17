import React from 'react';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';

const StickyAddToCart = ({ product, selectedVariant, quantity, onAddToCart, className = '' }) => {
  const { cartCount } = useCart();
  
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

  const finalPrice = getFinalPrice();
  const isFunding = product.status === 'Funding';

  return (
    <div className={`fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg md:hidden z-30 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">{product.title}</p>
          <p className="text-lg font-bold text-gray-900">${finalPrice?.toFixed(2)}</p>
        </div>
        <Button
          onClick={onAddToCart}
          className="px-6 py-3"
        >
          {isFunding ? 'Back Project' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default StickyAddToCart;