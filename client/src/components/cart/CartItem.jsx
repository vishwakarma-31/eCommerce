import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(item._id, newQuantity);
    }
  };

  return (
    <div className="flex py-6 border-b border-gray-200">
      <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
        {item.product.images && item.product.images.length > 0 ? (
          <img
            src={item.product.images[0]}
            alt={item.product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-xs">No image</span>
          </div>
        )}
      </div>

      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <Link to={`/product/${item.product._id}`}>{item.product.title}</Link>
            </h3>
            <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
        </div>
        <div className="flex-1 flex items-end justify-between text-sm">
          <div className="flex items-center">
            <span className="mr-2 text-gray-500">Qty:</span>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
            />
          </div>

          <div className="flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item._id)}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;