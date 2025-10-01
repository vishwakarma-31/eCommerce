import React from 'react';

const EarlyBirdRewards = ({ rewards, backersCount }) => {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6 border border-yellow-200">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-bold text-gray-900">Early Bird Rewards</h3>
          <p className="text-gray-600 mt-1">
            Limited-time discounts for the first backers! Only {rewards[0]?.limit - backersCount} spots left.
          </p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewards.map((reward, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-4 shadow-sm border border-yellow-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{reward.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{reward.description}</p>
                  </div>
                  {backersCount < reward.limit && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Available
                    </span>
                  )}
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Original Price</p>
                    <p className="text-sm line-through text-gray-400">${reward.originalPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Your Price</p>
                    <p className="text-lg font-bold text-gray-900">${reward.discountedPrice}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{backersCount} backers</span>
                    <span>{reward.limit - backersCount} left</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (backersCount / reward.limit) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                {backersCount >= reward.limit ? (
                  <button 
                    disabled
                    className="mt-3 w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed"
                  >
                    Sold Out
                  </button>
                ) : (
                  <button className="mt-3 w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-sm">
                    Claim Reward
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarlyBirdRewards;