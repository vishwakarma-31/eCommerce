import React from 'react';
import Button from '../common/Button';

const OrderConfirmationStep = ({ order, onContinueShopping }) => {
  if (!order) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-gray-900">Processing your order</h3>
        <p className="mt-2 text-gray-600">Please wait while we process your order...</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      
      <h3 className="mt-4 text-2xl font-bold text-gray-900">Order placed successfully!</h3>
      <p className="mt-2 text-gray-600">
        Thank you for your purchase. We've sent a confirmation email to {order.shippingAddress?.email || 'your email'}.
      </p>
      
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900">Order Details</h4>
            <dl className="mt-2 space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Order Number</dt>
                <dd className="text-sm font-medium text-gray-900">{order.orderNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Date</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Total</dt>
                <dd className="text-sm font-medium text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-900">Shipping Information</h4>
            <dl className="mt-2 space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Estimated Delivery</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'TBD'}
                </dd>
              </div>
              <div className="mt-4">
                <dt className="text-sm text-gray-600">Tracking</dt>
                <dd className="text-sm font-medium text-indigo-600">
                  <a href="#" className="hover:text-indigo-500">
                    Track your order
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button onClick={() => {}}>
            Download Invoice
          </Button>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={onContinueShopping}>
          Continue Shopping
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/orders'}>
          View Order Details
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationStep;