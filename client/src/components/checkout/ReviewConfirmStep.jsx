import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';

const ReviewConfirmStep = ({ onNext, onPrev, orderData, cartTotal, processing }) => {
  const { cartItems } = useCart();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const shipping = 0;
  const tax = cartTotal * 0.08; // 8% tax
  const discount = orderData.couponCode ? (cartTotal * 0.1) : 0; // 10% discount for demo
  const total = cartTotal + shipping + tax - discount;

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Review your order</h3>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        <div className="lg:col-span-7">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="text-md font-medium text-gray-900">Items</h4>
            </div>
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item._id} className="p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
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
                          <h3>{item.product.title}</h3>
                          <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        {item.variant && (
                          <div className="mt-1 text-sm text-gray-500">
                            {item.variant.size && <span>Size: {item.variant.size}</span>}
                            {item.variant.color && <span className="ml-2">Color: {item.variant.color}</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex items-end justify-between text-sm mt-2">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="text-md font-medium text-gray-900">Shipping Address</h4>
            </div>
            <div className="p-4">
              <p className="text-gray-900">
                {orderData.shippingAddress ? formatAddress(orderData.shippingAddress) : 'No address provided'}
              </p>
            </div>
          </div>
          
          {/* Order Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="text-md font-medium text-gray-900">Order Information</h4>
            </div>
            <div className="p-4">
              <p className="text-gray-900">
                Your order will be processed and shipped to the address above.
              </p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8">
            <h4 className="text-lg font-medium text-gray-900 mb-6">Order summary</h4>
            
            <dl className="space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">${cartTotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Shipping</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Tax</dt>
                <dd className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</dd>
              </div>
              {orderData.couponCode && (
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Discount ({orderData.couponCode})</dt>
                  <dd className="text-sm font-medium text-green-600">-${discount.toFixed(2)}</dd>
                </div>
              )}
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
              </div>
            </dl>
            
            <div className="mt-6">
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                </label>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <Button
                onClick={onNext}
                disabled={!acceptedTerms || processing}
                className="w-full"
              >
                {processing ? 'Placing Order...' : 'Place Order'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onPrev}
                className="w-full"
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewConfirmStep;