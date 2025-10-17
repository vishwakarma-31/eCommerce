import React, { useState, useRef, useEffect } from 'react';

const PullToRefresh = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    // Only enable pull to refresh when scrolled to the top
    if (containerRef.current.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
      setCurrentY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (startY === 0) return;
    
    const currentTouchY = e.touches[0].clientY;
    setCurrentY(currentTouchY);
    
    const distance = currentTouchY - startY;
    
    // Only allow pulling down
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance, 100)); // Limit pull distance
    }
  };

  const handleTouchEnd = async () => {
    if (startY === 0) return;
    
    const distance = currentY - startY;
    
    // Trigger refresh if pulled more than 60px
    if (distance > 60) {
      setIsRefreshing(true);
      setPullDistance(0);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    } else {
      setPullDistance(0);
    }
    
    setStartY(0);
    setCurrentY(0);
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-full overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div 
          className="flex justify-center items-center py-3 bg-white border-b border-gray-200 transition-all duration-200"
          style={{ 
            height: isRefreshing ? '50px' : `${Math.min(pullDistance, 50)}px`,
            opacity: pullDistance > 0 ? Math.min(pullDistance / 50, 1) : 1
          }}
        >
          {isRefreshing ? (
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2 text-gray-600">Refreshing...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <svg 
                className="h-5 w-5 text-gray-600 transition-transform duration-200"
                style={{ transform: `rotate(${pullDistance > 60 ? 180 : 0}deg)` }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="ml-2 text-gray-600">
                {pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
              </span>
            </div>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default PullToRefresh;