import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';
import Input from '../common/Input';
import AddressForm from './AddressForm';
import OrderSummary from './OrderSummary';

const MultiStepCheckout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getTotalPrice } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: ''
  });
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: ''
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [orderNotes, setOrderNotes] = useState('');

  // Initialize billing info with shipping info if sameAsShipping is true
  React.useEffect(() => {
    if (sameAsShipping) {
      setBillingInfo(shippingInfo);
    }
  }, [sameAsShipping, shippingInfo]);

  const handleShippingInfoChange = (field, value) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBillingInfoChange = (field, value) => {
    setBillingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = () => {
    // In a real application, this would submit the order to the backend
    console.log('Order submitted:', {
      shippingInfo,
      billingInfo: sameAsShipping ? shippingInfo : billingInfo,
      orderNotes,
      cartItems,
      total: getTotalPrice()
    });
    
    // Navigate to order confirmation page
    navigate('/profile/orders', { 
      state: { 
        message: 'Your order has been placed successfully!' 
      } 
    });
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to checkout.</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <Button onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Checkout
          </h2>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
          <li className={`flex md:w-full items-center ${currentStep >= 1 ? 'text-blue-600 dark:text-blue-500' : ''} after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:inline-block`}>
            <span className="flex items-center after:content-['/'] after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              <span className={`flex items-center justify-center w-6 h-6 rounded-full ${currentStep >= 1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'} mr-2`}>
                1
              </span>
              Shipping
            </span>
          </li>
          <li className={`flex md:w-full items-center ${currentStep >= 2 ? 'text-blue-600 dark:text-blue-500' : ''} after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:inline-block`}>
            <span className="flex items-center after:content-['/'] after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              <span className={`flex items-center justify-center w-6 h-6 rounded-full ${currentStep >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'} mr-2`}>
                2
              </span>
              Billing
            </span>
          </li>
          <li className={`flex md:w-full items-center ${currentStep >= 3 ? 'text-blue-600 dark:text-blue-500' : ''}`}>
            <span className="flex items-center">
              <span className={`flex items-center justify-center w-6 h-6 rounded-full ${currentStep >= 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'} mr-2`}>
                3
              </span>
              Review
            </span>
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
              <AddressForm 
                formData={shippingInfo}
                onFieldChange={handleShippingInfoChange}
              />
              <div className="mt-6">
                <Button onClick={handleNext}>
                  Continue to Billing
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">Same as shipping address</span>
                </label>
              </div>
              
              {!sameAsShipping && (
                <AddressForm 
                  formData={billingInfo}
                  onFieldChange={handleBillingInfoChange}
                />
              )}
              
              <div className="mt-6 flex space-x-4">
                <Button variant="outline" onClick={handlePrev}>
                  Back
                </Button>
                <Button onClick={handleNext}>
                  Continue to Review
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Review</h3>
              
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">Shipping Address</h4>
                <div className="text-sm text-gray-600">
                  <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                  <p>{shippingInfo.country}</p>
                  <p>{shippingInfo.phone}</p>
                </div>
              </div>
              
              {!sameAsShipping && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Billing Address</h4>
                  <div className="text-sm text-gray-600">
                    <p>{billingInfo.firstName} {billingInfo.lastName}</p>
                    <p>{billingInfo.address}</p>
                    <p>{billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}</p>
                    <p>{billingInfo.country}</p>
                    <p>{billingInfo.phone}</p>
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">Order Notes</h4>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Any special instructions for your order..."
                />
              </div>
              
              <div className="mt-6 flex space-x-4">
                <Button variant="outline" onClick={handlePrev}>
                  Back
                </Button>
                <Button onClick={handleSubmitOrder}>
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default MultiStepCheckout;