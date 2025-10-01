import React, { useState } from 'react';

const BackerLeaderboard = ({ backers }) => {
  const [privacyLevel, setPrivacyLevel] = useState('public'); // 'public', 'anonymous', 'private'

  const togglePrivacy = () => {
    const levels = ['public', 'anonymous', 'private'];
    const currentIndex = levels.indexOf(privacyLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    setPrivacyLevel(levels[nextIndex]);
  };

  const getPrivacyIcon = () => {
    switch (privacyLevel) {
      case 'public':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        );
      case 'anonymous':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
          </svg>
        );
      case 'private':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getPrivacyLabel = () => {
    switch (privacyLevel) {
      case 'public':
        return 'Public';
      case 'anonymous':
        return 'Anonymous';
      case 'private':
        return 'Private';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Top Backers</h3>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">{getPrivacyLabel()}</span>
          <button 
            onClick={togglePrivacy}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle privacy settings"
          >
            {getPrivacyIcon()}
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {backers.map((backer, index) => (
          <div 
            key={backer.id} 
            className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-800 font-bold">
                {index + 1}
              </span>
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <div className="flex items-center">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {privacyLevel === 'public' ? backer.name : 'Anonymous Backer'}
                </p>
                {index < 3 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Top {index + 1}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {backer.projectsSupported} projects supported
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                ${backer.totalSpent}
              </p>
              <p className="text-sm text-gray-500">
                {backer.backsCount} backs
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
          View full leaderboard
        </button>
      </div>
    </div>
  );
};

export default BackerLeaderboard;