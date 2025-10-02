import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@react-stripe/stripe-js';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

// Load Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ product, quantity, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Step 1: Create payment intent
      const response = await api.post('/preorders/create-payment-intent', {
        productConceptId: product._id,
        quantity: parseInt(quantity)
      });
      
      const { clientSecret } = response.data.paymentIntent;
      
      // Step 2: Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.name,
            email: user.email
          }
        },
        setup_future_usage: 'off_session'
      });
      
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      
      if (paymentIntent.status === 'requires_capture') {
        // Step 3: Store pre-order
        const preOrderResponse = await api.post('/preorders', {
          productConceptId: product._id,
          quantity: parseInt(quantity),
          stripePaymentIntentId: paymentIntent.id,
          shippingAddress
        });
        
        toast.success('Successfully backed the project!');
        onSuccess(preOrderResponse.data);
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={shippingAddress.street}
            onChange={handleAddressChange}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={shippingAddress.city}
              onChange={handleAddressChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={shippingAddress.state}
              onChange={handleAddressChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="zipCode"
              placeholder="ZIP Code"
              value={shippingAddress.zipCode}
              onChange={handleAddressChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
            <select
              name="country"
              value={shippingAddress.country}
              onChange={handleAddressChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
            </select>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
        <div className="p-4 border border-gray-300 rounded-md">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }} />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Back Project - $${(product.price * quantity).toFixed(2)}`}
      </button>
    </form>
  );
};

const PreOrderPaymentForm = ({ product, quantity, onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        product={product} 
        quantity={quantity} 
        onSuccess={onSuccess} 
      />
    </Elements>
  );
};

export default PreOrderPaymentForm;