import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import OrderPaymentForm from '../payments/OrderPaymentForm';

const PaymentStep = ({ onNext, onPrev, onUpdateOrderData, orderData, cartTotal, cartItems }) => {
  const [paymentMethod, setPaymentMethod] = useState(orderData.paymentMethod || 'card');
  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });
  const [errors, setErrors] = useState({});
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState(orderData.couponCode || '');
  const [couponError, setCouponError] = useState('');

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateCardForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'card') {
      if (!cardData.cardName) newErrors.cardName = 'Name on card is required';
      if (!cardData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      if (!cardData.cardExpiry) newErrors.cardExpiry = 'Expiration date is required';
      if (!cardData.cardCvc) {
        newErrors.cardCvc = 'CVC is required';
      } else if (!/^\d{3,4}$/.test(cardData.cardCvc)) {
        newErrors.cardCvc = 'CVC must be 3 or 4 digits';
      }
    }
    
    return newErrors;
  };

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
    
    const formErrors = validateCardForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Save payment method and card data to order data
    onUpdateOrderData({ 
      paymentMethod,
      ...(paymentMethod === 'card' ? { cardData } : {})
    });
    
    // For non-card payment methods, we can proceed to next step
    if (paymentMethod !== 'card') {
      onNext();
    }
  };

  const handleOrderSuccess = (order) => {
    // Save the order to orderData
    onUpdateOrderData({ order });
    // Move to the next step (order confirmation)
    onNext();
  };

  const shipping = 0;
  const tax = cartTotal * 0.08; // 8% tax
  const discount = orderData.couponCode ? (cartTotal * 0.1) : 0; // 10% discount for demo
  const total = cartTotal + shipping + tax - discount;

  // If payment method is card, show the payment form
  if (paymentMethod === 'card') {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6">Payment method</h3>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Payment Method Selection */}
                <fieldset>
                  <legend className="text-lg font-medium text-gray-900">Payment options</legend>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="payment-card"
                        name="payment-method"
                        type="radio"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <label htmlFor="payment-card" className="ml-3 block text-sm font-medium text-gray-700">
                        Credit or debit card
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="payment-cod"
                        name="payment-method"
                        type="radio"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <label htmlFor="payment-cod" className="ml-3 block text-sm font-medium text-gray-700">
                        Cash on Delivery
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="payment-upi"
                        name="payment-method"
                        type="radio"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <label htmlFor="payment-upi" className="ml-3 block text-sm font-medium text-gray-700">
                        PayPal
                      </label>
                    </div>
                  </div>
                </fieldset>
                
                {/* Card Details Form (only shown when card is selected) */}
                {paymentMethod === 'card' && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Card details</h4>
                    
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div className="sm:col-span-2">
                        <Input
                          label="Name on card"
                          id="cardName"
                          name="cardName"
                          value={cardData.cardName}
                          onChange={handleCardChange}
                          error={errors.cardName}
                          required
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <Input
                          label="Card number"
                          id="cardNumber"
                          name="cardNumber"
                          value={cardData.cardNumber}
                          onChange={handleCardChange}
                          error={errors.cardNumber}
                          placeholder="0000 0000 0000 0000"
                          required
                        />
                      </div>
                      
                      <Input
                        label="Expiration date"
                        id="cardExpiry"
                        name="cardExpiry"
                        value={cardData.cardExpiry}
                        onChange={handleCardChange}
                        error={errors.cardExpiry}
                        placeholder="MM/YY"
                        required
                      />
                      
                      <Input
                        label="CVC"
                        id="cardCvc"
                        name="cardCvc"
                        value={cardData.cardCvc}
                        onChange={handleCardChange}
                        error={errors.cardCvc}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                )}
                
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
                    Continue to Payment
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
  }
  
  // For non-card payment methods, show the payment form directly
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Complete your payment</h3>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        <div className="lg:col-span-7">
          <OrderPaymentForm 
            items={cartItems}
            paymentMethod={paymentMethod}
            onSuccess={handleOrderSuccess}
          />
          
          <div className="mt-6 flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPaymentMethod('card')}
            >
              Back to Payment Methods
            </Button>
          </div>
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