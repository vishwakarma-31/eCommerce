import React, { useState, useRef } from 'react';

const PullToRefresh = ({ children, onRefresh, refreshing }) => {
  const [pullStart, setPullStart] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    // Only enable pull-to-refresh when scrolled to the top
    if (containerRef.current.scrollTop === 0) {
      setIsPulling(true);
      setPullStart(e.touches[0].clientY);
      setPullDistance(0);
    }
  };

  const handleTouchMove = (e) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].clientY;
    const distance = currentY - pullStart;
    
    // Only allow pulling down
    if (distance > 0) {
      setPullDistance(Math.min(distance, 100)); // Max 100px pull distance
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    // If pulled more than 60px, trigger refresh
    if (pullDistance > 60 && onRefresh) {
      await onRefresh();
    }
    
    setPullDistance(0);
  };

  return (
    <div 
      ref={containerRef}
      className="relative overflow-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      {(isPulling || refreshing) && (
        <div 
          className="flex justify-center items-center py-2 transition-transform duration-200"
          style={{ 
            transform: `translateY(${isPulling ? pullDistance : 0}px)`,
            height: refreshing ? '50px' : `${Math.min(pullDistance, 50)}px`
          }}
        >
          {refreshing ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          ) : (
            <svg 
              className={`w-6 h-6 text-indigo-600 transition-transform ${pullDistance > 60 ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default PullToRefresh;