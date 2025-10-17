import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@react-stripe/stripe-js';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

// Load Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ items, onSuccess, paymentMethod }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { clearCart } = useCart();
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
      // Step 1: Create payment based on selected method
      const paymentResponse = await api.post('/orders/create-payment', {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        paymentMethod
      });
      
      // Step 2: Process payment based on method
      let orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        paymentMethod,
        shippingAddress
      };
      
      if (paymentMethod === 'card') {
        const { clientSecret } = paymentResponse.data;
        
        // Confirm payment with Stripe (automatic capture)
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user.name,
              email: user.email
            }
          }
        });
        
        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }
        
        if (paymentIntent.status === 'succeeded') {
          orderData.stripePaymentIntentId = paymentIntent.id;
        } else {
          toast.error('Payment was not successful. Please try again.');
          setLoading(false);
          return;
        }
      } else if (paymentMethod === 'paypal') {
        // For PayPal, we would redirect to PayPal
        // In a real implementation, you would redirect the user to PayPal
        toast.info('Redirecting to PayPal for payment...');
        // For demo purposes, we'll just simulate a successful payment
        orderData.paypalPaymentId = 'paypal_payment_id_demo';
      } else if (paymentMethod === 'cod') {
        // For Cash on Delivery, no additional payment processing is needed
        toast.info('Order will be processed with Cash on Delivery');
      }
      
      // Step 3: Create order
      const orderResponse = await api.post('/orders', orderData);
      
      // Clear cart
      clearCart();
      
      toast.success('Order placed successfully!');
      onSuccess(orderResponse.data);
    } catch (error) {
      toast.error('Order failed. Please try again.');
      console.error('Order error:', error);
    }
    
    setLoading(false);
  };

  const totalAmount = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

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
      
      {paymentMethod === 'card' && (
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
      )}
      
      {paymentMethod === 'paypal' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800">You will be redirected to PayPal to complete your payment.</p>
        </div>
      )}
      
      {paymentMethod === 'cod' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">You will pay in cash when your order is delivered.</p>
        </div>
      )}
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between text-lg font-medium text-gray-900">
          <p>Total</p>
          <p>${totalAmount.toFixed(2)}</p>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Place Order - $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
};

const OrderPaymentForm = ({ items, onSuccess, paymentMethod }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        items={items} 
        onSuccess={onSuccess} 
        paymentMethod={paymentMethod}
      />
    </Elements>
  );
};

export default OrderPaymentForm;