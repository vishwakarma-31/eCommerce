import React, { useState, useEffect } from 'react';

const LiveFundingAnimation = ({ currentFunding, fundingGoal, onNewBacker }) => {
  const [displayedFunding, setDisplayedFunding] = useState(currentFunding);
  const [isAnimating, setIsAnimating] = useState(false);
  const [recentBackers, setRecentBackers] = useState([]);

  // Simulate new backers (in a real app, this would come from WebSocket or polling)
  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance to simulate a new backer
      if (Math.random() > 0.7 && displayedFunding < fundingGoal) {
        const newBacker = {
          id: Date.now(),
          name: `Backer ${Math.floor(Math.random() * 1000)}`,
          amount: Math.floor(Math.random() * 50) + 10,
          timestamp: new Date()
        };
        
        setRecentBackers(prev => [newBacker, ...prev.slice(0, 4)]); // Keep only last 5 backers
        setDisplayedFunding(prev => Math.min(prev + newBacker.amount, fundingGoal));
        setIsAnimating(true);
        
        // Trigger the onNewBacker callback if provided
        if (onNewBacker) {
          onNewBacker(newBacker);
        }
        
        // Reset animation state after a short delay
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }, 5000); // Check for new backers every 5 seconds

    return () => clearInterval(interval);
  }, [displayedFunding, fundingGoal, onNewBacker]);

  const percentage = Math.min(100, Math.round((displayedFunding / fundingGoal) * 100));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Live Funding Progress</h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>${displayedFunding} of ${fundingGoal} raised</span>
          <span>{percentage}% funded</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`bg-primary-gradient h-4 rounded-full transition-all duration-1000 ease-out ${isAnimating ? 'animate-pulse' : ''}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      
      {recentBackers.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Recent Backers</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {recentBackers.map((backer) => (
              <div 
                key={backer.id} 
                className={`flex items-center p-2 rounded-lg ${isAnimating ? 'bg-green-50' : 'bg-gray-50'}`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-800 font-bold text-xs">
                    {backer.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {backer.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Backed ${backer.amount}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Just now
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveFundingAnimation;