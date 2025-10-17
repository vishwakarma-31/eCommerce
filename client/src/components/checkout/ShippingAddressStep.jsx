import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';

const ShippingAddressStep = ({ onNext, onPrev, onUpdateOrderData, orderData }) => {
  const { currentUser } = useAuth();
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [errors, setErrors] = useState({});

  // Initialize with user's saved addresses
  useEffect(() => {
    if (currentUser && currentUser.addresses) {
      setAddresses(currentUser.addresses);
      if (currentUser.addresses.length > 0) {
        setSelectedAddress(currentUser.addresses[0]);
      }
    }
  }, [currentUser]);

  // Prefill form if we have existing shipping address data
  useEffect(() => {
    if (orderData.shippingAddress) {
      setFormData(orderData.shippingAddress);
    }
  }, [orderData.shippingAddress]);

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
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.street) newErrors.street = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Save shipping address to order data
    onUpdateOrderData({ shippingAddress: formData });
    onNext();
  };

  const handleSelectSavedAddress = (address) => {
    setSelectedAddress(address);
    setFormData({
      firstName: currentUser.name.split(' ')[0] || '',
      lastName: currentUser.name.split(' ')[1] || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || 'United States'
    });
  };

  const shippingCost = 0; // Free shipping for now

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Shipping information</h3>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        <div className="lg:col-span-7">
          {addresses.length > 0 && (
            <div className="mb-8">
              <h4 className="text-md font-medium text-gray-900 mb-4">Saved Addresses</h4>
              <div className="space-y-4">
                {addresses.map((address, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedAddress === address 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleSelectSavedAddress(address)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`address-${index}`}
                        name="selectedAddress"
                        checked={selectedAddress === address}
                        onChange={() => handleSelectSavedAddress(address)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <label htmlFor={`address-${index}`} className="ml-3 block text-sm font-medium text-gray-700">
                        {address.street}, {address.city}, {address.state} {address.zipCode}
                        {address.isDefault && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            Default
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  {showNewAddressForm ? 'Cancel' : '+ Add new address'}
                </button>
              </div>
            </div>
          )}
          
          {(showNewAddressForm || addresses.length === 0) && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
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
                    label="Street address"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    error={errors.street}
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
              
              <div className="mt-6 flex space-x-4">
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
            </form>
          )}
          
          {addresses.length > 0 && !showNewAddressForm && (
            <div className="mt-6 flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onPrev}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  onUpdateOrderData({ shippingAddress: formData });
                  onNext();
                }}
              >
                Continue to Payment
              </Button>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8">
            <h4 className="text-lg font-medium text-gray-900 mb-6">Shipping options</h4>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="shipping-standard"
                  name="shipping-method"
                  type="radio"
                  defaultChecked
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="shipping-standard" className="ml-3 block text-sm font-medium text-gray-700">
                  Standard Shipping
                </label>
                <span className="ml-auto text-sm font-medium text-gray-900">
                  {shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free'}
                </span>
              </div>
              
              <div className="flex items-center">
                <input
                  id="shipping-express"
                  name="shipping-method"
                  type="radio"
                  disabled
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="shipping-express" className="ml-3 block text-sm font-medium text-gray-700 text-gray-400">
                  Express Shipping
                </label>
                <span className="ml-auto text-sm font-medium text-gray-400">
                  $15.00
                </span>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Delivery estimates will be shown at checkout.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressStep;