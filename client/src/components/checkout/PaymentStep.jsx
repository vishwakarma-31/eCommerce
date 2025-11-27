import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const PaymentStep = ({ onNext, onPrev, onUpdateOrderData, orderData, cartTotal, cartItems }) => {
  const [errors, setErrors] = useState({});
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState(orderData.couponCode || '');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    setApplyingCoupon(true);
    setCouponError('');
    
    // In a real implementation, this would call a coupon service
    try {
      // Simulate coupon validation
      if (couponCode === 'WELCOME10' || couponCode === 'SAVE20') {
        onUpdateOrderData({ couponCode });
      } else {
        throw new Error('Invalid coupon code');
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Move to the next step
    onNext();
  };

  const shipping = 0;
  const tax = cartTotal * 0.08; // 8% tax
  const discount = orderData.couponCode ? (cartTotal * 0.1) : 0; // 10% discount for demo
  const total = cartTotal + shipping + tax - discount;

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h3>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Order Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-blue-800">
                  Your order will be processed and shipped to your provided address.
                </p>
              </div>
              
              {/* Coupon Code */}
              <div>
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
              
              {/* Navigation Buttons */}
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPrev}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                >
                  Continue to Confirmation
                </Button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
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
                <dd className="text-sm font-medium text-gray-900">${shipping.toFixed(2)}</dd>
              </div>
              
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Tax</dt>
                <dd className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</dd>
              </div>
              
              {orderData.couponCode && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
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
                  required
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;