import React from 'react';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';

const OrderSummary = () => {
  const { cartItems, getTotalPrice, getTotalItems } = useCart();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center">
            <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No image</span>
                </div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
              <p className="text-sm text-gray-500">Qty {item.quantity}</p>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;