import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const SettingsPage = () => {
  const { currentUser, changePassword, updateEmailPreferences, deleteAccount } = useAuth();
  const navigate = useNavigate();
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Email preferences state
  const [emailPreferences, setEmailPreferences] = useState({
    newsletter: currentUser?.emailPreferences?.newsletter || false,
    orderUpdates: currentUser?.emailPreferences?.orderUpdates || true,
    productUpdates: currentUser?.emailPreferences?.productUpdates || true,
    promotions: currentUser?.emailPreferences?.promotions || false
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState('password');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailPreferencesChange = (e) => {
    const { name, checked } = e.target;
    setEmailPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccessMessage('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPreferencesSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await updateEmailPreferences(emailPreferences);
      setSuccessMessage('Email preferences updated successfully');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update email preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
      setErrorMessage('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await deleteAccount();
      // User will be logged out automatically after account deletion
      navigate('/');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Account Settings
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('password')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'email'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Email Preferences
          </button>
          <button
            onClick={() => setActiveTab('delete')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'delete'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Delete Account
          </button>
        </nav>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
      )}
      
      {errorMessage && (
        <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update your account password regularly for better security.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <form onSubmit={handlePasswordSubmit} className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Current Password"
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
                
                <Input
                  label="New Password"
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
                
                <Input
                  label="Confirm New Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Preferences Tab */}
      {activeTab === 'email' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Email Preferences</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Choose which emails you'd like to receive.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <form onSubmit={handleEmailPreferencesSubmit} className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="newsletter"
                      name="newsletter"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={emailPreferences.newsletter}
                      onChange={handleEmailPreferencesChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="newsletter" className="font-medium text-gray-700">
                      Newsletter
                    </label>
                    <p className="text-gray-500">
                      Receive our monthly newsletter with company news and updates.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="orderUpdates"
                      name="orderUpdates"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={emailPreferences.orderUpdates}
                      onChange={handleEmailPreferencesChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="orderUpdates" className="font-medium text-gray-700">
                      Order Updates
                    </label>
                    <p className="text-gray-500">
                      Get notified about your order status and shipping updates.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="productUpdates"
                      name="productUpdates"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={emailPreferences.productUpdates}
                      onChange={handleEmailPreferencesChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="productUpdates" className="font-medium text-gray-700">
                      Product Updates
                    </label>
                    <p className="text-gray-500">
                      Be the first to know about new products and features.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="promotions"
                      name="promotions"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={emailPreferences.promotions}
                      onChange={handleEmailPreferencesChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="promotions" className="font-medium text-gray-700">
                      Promotions & Discounts
                    </label>
                    <p className="text-gray-500">
                      Receive exclusive offers and discounts.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Tab */}
      {activeTab === 'delete' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Permanently remove your account and all associated data.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      <strong>Warning:</strong> This action cannot be undone. Deleting your account will permanently remove all your data including:
                    </p>
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                      <li>Your profile information</li>
                      <li>Order history</li>
                      <li>Wishlist items</li>
                      <li>Saved addresses</li>
                      <li>Product reviews</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="deleteConfirmation" className="block text-sm font-medium text-gray-700 mb-1">
                  Type "DELETE MY ACCOUNT" to confirm
                </label>
                <input
                  type="text"
                  id="deleteConfirmation"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="DELETE MY ACCOUNT"
                />
              </div>
              
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={loading || deleteConfirmation !== 'DELETE MY ACCOUNT'}
              >
                {loading ? 'Deleting Account...' : 'Delete Account Permanently'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;