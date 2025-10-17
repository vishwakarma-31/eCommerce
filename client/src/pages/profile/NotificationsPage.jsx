import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const NotificationsPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    inAppNotifications: true
  });

  // Mock data for demonstration
  const mockNotifications = [
    {
      _id: '1',
      title: 'Order Shipped',
      message: 'Your order #ORD-001 has been shipped.',
      type: 'ORDER_STATUS_UPDATE',
      isRead: false,
      createdAt: '2023-05-15T10:30:00Z'
    },
    {
      _id: '2',
      title: 'New Product',
      message: 'Check out our new product launch!',
      type: 'NEW_PRODUCT',
      isRead: true,
      createdAt: '2023-05-14T14:20:00Z'
    },
    {
      _id: '3',
      title: 'Funding Milestone',
      message: 'The project you backed has reached 75% funding!',
      type: 'FUNDING_MILESTONE',
      isRead: false,
      createdAt: '2023-05-13T09:15:00Z'
    }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      // In a real implementation, this would fetch notifications from the API
      setLoading(true);
      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 500);
    }
  }, [isAuthenticated]);

  const handleMarkAsRead = (notificationId) => {
    // In a real implementation, this would call an API endpoint
    setNotifications(notifications.map(notification => 
      notification._id === notificationId 
        ? { ...notification, isRead: true } 
        : notification
    ));
  };

  const handleMarkAsUnread = (notificationId) => {
    // In a real implementation, this would call an API endpoint
    setNotifications(notifications.map(notification => 
      notification._id === notificationId 
        ? { ...notification, isRead: false } 
        : notification
    ));
  };

  const handleDeleteNotification = (notificationId) => {
    // In a real implementation, this would call an API endpoint
    setNotifications(notifications.filter(notification => 
      notification._id !== notificationId
    ));
  };

  const handleMarkAllAsRead = () => {
    // In a real implementation, this would call an API endpoint
    setNotifications(notifications.map(notification => 
      ({ ...notification, isRead: true })
    ));
  };

  const handleDeleteRead = () => {
    // In a real implementation, this would call an API endpoint
    setNotifications(notifications.filter(notification => 
      !notification.isRead
    ));
  };

  const handlePreferenceChange = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ORDER_STATUS_UPDATE':
        return (
          <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'NEW_PRODUCT':
        return (
          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'FUNDING_MILESTONE':
        return (
          <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
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
          <p className="text-gray-600 mb-6">You need to be logged in to view your notifications.</p>
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
            Notifications
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
          <Button variant="outline" size="sm" onClick={handleDeleteRead}>
            Delete Read
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Notifications</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your latest notifications and updates.
              </p>
            </div>
            <div className="border-t border-gray-200">
              {notifications.length === 0 ? (
                <div className="px-4 py-12 sm:px-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any notifications right now.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <li key={notification._id} className={notification.isRead ? 'bg-gray-50' : 'bg-white'}>
                      <div className="px-4 py-6 sm:px-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-lg font-medium ${notification.isRead ? 'text-gray-900' : 'text-gray-900 font-bold'}`}>
                                {notification.title}
                              </h4>
                              <div className="text-sm text-gray-500">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              {notification.message}
                            </div>
                            <div className="mt-3 flex space-x-2">
                              {!notification.isRead ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification._id)}
                                >
                                  Mark as Read
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkAsUnread(notification._id)}
                                >
                                  Mark as Unread
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteNotification(notification._id)}
                              >
                                Delete
                              </Button>
                            </div>
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

        <div className="lg:col-span-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Preferences</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Choose how you want to be notified.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <button
                      type="button"
                      className={`${
                        preferences.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      onClick={() => handlePreferenceChange('emailNotifications')}
                    >
                      <span
                        className={`${
                          preferences.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                        } inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                    </div>
                    <button
                      type="button"
                      className={`${
                        preferences.pushNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      onClick={() => handlePreferenceChange('pushNotifications')}
                    >
                      <span
                        className={`${
                          preferences.pushNotifications ? 'translate-x-5' : 'translate-x-0'
                        } inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">In-App Notifications</h4>
                      <p className="text-sm text-gray-500">Show notifications within the app</p>
                    </div>
                    <button
                      type="button"
                      className={`${
                        preferences.inAppNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      onClick={() => handlePreferenceChange('inAppNotifications')}
                    >
                      <span
                        className={`${
                          preferences.inAppNotifications ? 'translate-x-5' : 'translate-x-0'
                        } inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" disabled>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;