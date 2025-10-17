import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const AddressesPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.addresses) {
      setAddresses(currentUser.addresses);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.street) {
      newErrors.street = 'Street address is required';
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
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
    
    setSaving(true);
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll just update the local state
      
      if (editingAddress) {
        // Update existing address
        const updatedAddresses = addresses.map(addr => 
          addr._id === editingAddress._id ? { ...addr, ...formData } : addr
        );
        setAddresses(updatedAddresses);
      } else {
        // Add new address
        const newAddress = {
          _id: Date.now().toString(),
          ...formData
        };
        setAddresses([...addresses, newAddress]);
      }
      
      // Reset form
      setFormData({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false
      });
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Failed to save address'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault || false
    });
    setShowForm(true);
  };

  const handleDelete = (addressId) => {
    // In a real implementation, this would call an API endpoint
    const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
    setAddresses(updatedAddresses);
  };

  const handleSetDefault = (addressId) => {
    // In a real implementation, this would call an API endpoint
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr._id === addressId
    }));
    setAddresses(updatedAddresses);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false
    });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to manage your addresses.</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
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
            Manage Addresses
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button onClick={() => setShowForm(true)}>
            Add Address
          </Button>
        </div>
      </div>

      {errors.general && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="text-sm text-red-700">
            {errors.general}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Street Address"
                  id="street"
                  name="street"
                  type="text"
                  value={formData.street}
                  onChange={handleChange}
                  error={errors.street}
                  required
                />
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    label="City"
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    error={errors.city}
                    required
                  />
                  
                  <Input
                    label="State/Province"
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    error={errors.state}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    label="ZIP/Postal Code"
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={handleChange}
                    error={errors.zipCode}
                    required
                  />
                  
                  <Input
                    label="Country"
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    error={errors.country}
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="isDefault"
                    name="isDefault"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={formData.isDefault}
                    onChange={handleChange}
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                    Set as default address
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Saved Addresses</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your shipping addresses.
          </p>
        </div>
        <div className="border-t border-gray-200">
          {addresses.length === 0 ? (
            <div className="px-4 py-12 sm:px-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new address.
              </p>
              <div className="mt-6">
                <Button onClick={() => setShowForm(true)}>
                  Add Address
                </Button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {addresses.map((address) => (
                <li key={address._id}>
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <h4 className="text-lg font-medium text-gray-900">
                            {address.street}
                          </h4>
                          {address.isDefault && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {address.city}, {address.state} {address.zipCode}
                        </div>
                        <div className="text-sm text-gray-500">
                          {address.country}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(address._id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(address)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(address._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressesPage;