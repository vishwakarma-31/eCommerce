import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';
import Input from '../common/Input';

const CartReviewStep = ({ onNext, onUpdateOrderData, orderData }) => {
  const { cartItems, updateQuantity, removeFromCart, applyCoupon, cartTotal } = useCart();
  const [couponCode, setCouponCode] = useState(orderData.couponCode || '');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    setApplyingCoupon(true);
    setCouponError('');
    
    try {
      await applyCoupon(couponCode);
      onUpdateOrderData({ couponCode });
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const shipping = 0;
  const tax = cartTotal * 0.08; // 8% tax
  const total = cartTotal + shipping + tax;

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Review your cart</h3>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item._id} className="p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
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
                        <div className="flex items-center">
                          <label htmlFor={`quantity-${item._id}`} className="mr-2 text-gray-600">Qty:</label>
                          <select
                            id={`quantity-${item._id}`}
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item._id, parseInt(e.target.value))}
                            className="rounded border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            {[...Array(10)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                          </select>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item._id)}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Coupon Code */}
          <div className="mt-6">
            <form onSubmit={handleApplyCoupon} className="flex">
              <Input
                label="Coupon Code"
                id="couponCode"
                name="couponCode"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 mr-2"
              />
              <Button
                type="submit"
                disabled={applyingCoupon}
                className="self-end h-10"
              >
                {applyingCoupon ? 'Applying...' : 'Apply'}
              </Button>
            </form>
            {couponError && <p className="mt-1 text-sm text-red-600">{couponError}</p>}
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
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
              </div>
            </dl>
            
            <div className="mt-6">
              <Button
                onClick={onNext}
                className="w-full"
              >
                Continue to Shipping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartReviewStep;