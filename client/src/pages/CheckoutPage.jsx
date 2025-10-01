import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const CheckoutPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const validateForm = () => {
    const newErrors = {};
    
    // Shipping info validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    
    // Payment info validation
    if (!formData.cardName) newErrors.cardName = 'Name on card is required';
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (!formData.cardExpiry) newErrors.cardExpiry = 'Expiration date is required';
    if (!formData.cardCvc) {
      newErrors.cardCvc = 'CVC is required';
    } else if (!/^\d{3,4}$/.test(formData.cardCvc)) {
      newErrors.cardCvc = 'CVC must be 3 or 4 digits';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // In a real implementation, this would call a payment service
      clearCart();
      setProcessing(false);
      navigate('/orders', { 
        state: { 
          message: 'Order placed successfully! Thank you for your purchase.' 
        } 
      });
    }, 2000);
  };

  const shipping = 0;
  const tax = cartTotal * 0.08; // 8% tax
  const total = cartTotal + shipping + tax;

  if (!isAuthenticated) {
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
          <p className="text-gray-600 mb-6">Add some products to your cart before checking out.</p>
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

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        <div>
          <form onSubmit={handleSubmit}>
            <div className="border-b border-gray-200 pb-10">
              <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
              
              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <Input
                  label="First name"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  required
                />
                
                <Input
                  label="Last name"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  required
                />
                
                <div className="sm:col-span-2">
                  <Input
                    label="Email address"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Input
                    label="Address"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    required
                  />
                </div>
                
                <Input
                  label="City"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  required
                />
                
                <Input
                  label="State"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                  required
                />
                
                <Input
                  label="ZIP / Postal code"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  error={errors.zipCode}
                  required
                />
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-10 border-b border-gray-200 pb-10">
              <h2 className="text-lg font-medium text-gray-900">Payment</h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Name on card"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    error={errors.cardName}
                    required
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Input
                    label="Card number"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    error={errors.cardNumber}
                    placeholder="0000 0000 0000 0000"
                    required
                  />
                </div>
                
                <Input
                  label="Expiration date (MM/YY)"
                  id="cardExpiry"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  error={errors.cardExpiry}
                  placeholder="MM/YY"
                  required
                />
                
                <Input
                  label="CVC"
                  id="cardCvc"
                  name="cardCvc"
                  value={formData.cardCvc}
                  onChange={handleChange}
                  error={errors.cardCvc}
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div className="mt-10">
              <Button
                type="submit"
                className="w-full"
                disabled={processing}
              >
                {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-10 lg:mt-0">
          <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Order summary</h2>
            
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.product._id} className="flex py-4">
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
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <dl className="space-y-4 border-t border-gray-200 pt-4 mt-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;