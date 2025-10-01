import React from 'react';
import Button from '../common/Button';
import { Link } from 'react-router-dom';

const CartSummary = ({ subtotal, shipping = 0, tax = 0, onCheckout }) => {
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Order summary</h2>
      
      <dl className="space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Subtotal</dt>
          <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Shipping</dt>
          <dd className="text-sm font-medium text-gray-900">
            {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Tax</dt>
          <dd className="text-sm font-medium text-gray-900">
            {tax > 0 ? `$${tax.toFixed(2)}` : '$0.00'}
          </dd>
        </div>
        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
          <dt className="text-base font-medium text-gray-900">Order total</dt>
          <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button
          onClick={onCheckout}
          className="w-full"
        >
          Checkout
        </Button>
      </div>

      <div className="mt-4 text-center">
        <Link to="/products" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;