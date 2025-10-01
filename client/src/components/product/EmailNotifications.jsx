import React, { useState } from 'react';

const EmailNotifications = ({ product, user }) => {
  const [notifications, setNotifications] = useState({
    projectFunded: true,
    projectLive: true,
    newComment: true,
    orderShipped: true,
    newProducts: true
  });

  const handleToggle = (notificationType) => {
    setNotifications(prev => ({
      ...prev,
      [notificationType]: !prev[notificationType]
    }));
  };

  const getEmailPreview = (type) => {
    switch (type) {
      case 'projectFunded':
        return {
          subject: `🎉 ${product.title} has been successfully funded!`,
          preview: `Great news! The project you backed has reached its funding goal.`
        };
      case 'projectLive':
        return {
          subject: `🚀 ${product.title} is now live!`,
          preview: `The project you backed is now available for purchase.`
        };
      case 'newComment':
        return {
          subject: `💬 New comment on ${product.title}`,
          preview: `Someone commented on the project you're following.`
        };
      case 'orderShipped':
        return {
          subject: `📦 Your order for ${product.title} has shipped!`,
          preview: `Your order is on its way. Track your shipment here.`
        };
      case 'newProducts':
        return {
          subject: `✨ New products in ${product.category}`,
          preview: `Check out these new products in categories you're interested in.`
        };
      default:
        return { subject: '', preview: '' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Email Notifications</h3>
      <p className="text-gray-600 mb-6">
        Choose which notifications you'd like to receive about this project.
      </p>
      
      <div className="space-y-4">
        {Object.entries(notifications).map(([key, enabled]) => {
          const preview = getEmailPreview(key);
          return (
            <div key={key} className="flex items-start p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
              <div className="flex items-center h-5">
                <input
                  id={key}
                  name={key}
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleToggle(key)}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                  {preview.subject}
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  {preview.preview}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 flex items-center">
        <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="ml-3">
          <p className="text-sm text-gray-500">
            Notifications will be sent to <span className="font-medium text-gray-700">{user?.email || 'your registered email'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailNotifications;