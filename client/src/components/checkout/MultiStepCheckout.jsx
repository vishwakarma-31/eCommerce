import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CartReviewStep from './CartReviewStep';
import ShippingAddressStep from './ShippingAddressStep';
import PaymentStep from './PaymentStep';
import ReviewConfirmStep from './ReviewConfirmStep';
import OrderConfirmationStep from './OrderConfirmationStep';
import GuestCheckoutStep from './GuestCheckoutStep';
import ProgressBar from '../common/ProgressBar';

const MultiStepCheckout = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { cart, cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Checkout steps
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    items: [],
    shippingAddress: null,
    paymentMethod: null,
    couponCode: null,
    stripePaymentIntentId: null
  });
  const [order, setOrder] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Initialize order data with cart items
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setOrderData(prev => ({
        ...prev,
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        }))
      }));
    }
  }, [cartItems]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Handle step navigation
  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Update order data
  const updateOrderData = (data) => {
    setOrderData(prev => ({ ...prev, ...data }));
  };

  // Handle order placement
  const placeOrder = async () => {
    setProcessing(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the order service
      // For now, we'll simulate order creation
      const newOrder = {
        _id: 'order-' + Date.now(),
        orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        items: orderData.items,
        totalAmount: cartTotal,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        createdAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      };
      
      setOrder(newOrder);
      clearCart();
      nextStep(); // Move to confirmation step
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  // Render step content
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CartReviewStep 
            onNext={nextStep}
            onUpdateOrderData={updateOrderData}
            orderData={orderData}
          />
        );
      case 2:
        return (
          <ShippingAddressStep 
            onNext={nextStep}
            onPrev={prevStep}
            onUpdateOrderData={updateOrderData}
            orderData={orderData}
          />
        );
      case 3:
        return (
          <PaymentStep 
            onNext={nextStep}
            onPrev={prevStep}
            onUpdateOrderData={updateOrderData}
            orderData={orderData}
            cartTotal={cartTotal}
          />
        );
      case 4:
        return (
          <ReviewConfirmStep 
            onNext={placeOrder}
            onPrev={prevStep}
            orderData={orderData}
            cartTotal={cartTotal}
            processing={processing}
          />
        );
      case 5:
        return (
          <OrderConfirmationStep 
            order={order}
            onContinueShopping={() => navigate('/products')}
          />
        );
      default:
        return null;
    }
  };

  // Step titles
  const stepTitles = [
    'Cart Review',
    'Shipping Address',
    'Payment',
    'Review & Confirm',
    'Confirmation'
  ];

  // For guest users, show guest checkout step
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GuestCheckoutStep />
      </div>
    );
  }

  // For authenticated users with empty cart
  if (cartItems && cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart before checking out.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Browse Products
          </button>
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

      {/* Progress Bar */}
      <div className="mb-8">
        <ProgressBar 
          currentStep={currentStep}
          totalSteps={5}
          stepTitles={stepTitles}
        />
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default MultiStepCheckout;