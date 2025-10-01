import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { validateEmail } from '../utils/security';

const ProfilePage = () => {
  const { currentUser, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        bio: currentUser.bio || ''
      });
    }
  }, [currentUser]);

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
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email address is invalid';
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
    
    setUpdating(true);
    try {
      await updateProfile(formData);
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setUpdating(false);
    }
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
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
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
            My Profile
          </h2>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details and application access.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            {errors.general && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <div className="text-sm text-red-700">
                  {errors.general}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Full Name"
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              
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
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.bio}
                  onChange={handleChange}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Brief description for your profile. URLs are hyperlinked.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="mt-1 flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {currentUser?.role}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                type="submit"
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;