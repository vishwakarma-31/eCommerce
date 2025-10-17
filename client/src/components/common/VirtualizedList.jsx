import React, { useState, useEffect, useCallback } from 'react';

/**
 * Virtualized List Component
 * Renders only visible items for better performance with large lists
 */
const VirtualizedList = ({ 
  items = [], 
  itemHeight = 200, 
  renderItem, 
  containerHeight = 600,
  buffer = 5
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });

  // Calculate visible range based on scroll position
  const calculateVisibleRange = useCallback(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const visibleCount = Math.ceil(containerHeight / itemHeight) + buffer * 2;
    const end = Math.min(items.length, start + visibleCount);
    
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, items.length, buffer]);

  // Update visible range when scroll position changes
  useEffect(() => {
    setVisibleRange(calculateVisibleRange());
  }, [scrollTop, calculateVisibleRange]);

  // Handle scroll events
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  // Calculate total height for scrollbar
  const totalHeight = items.length * itemHeight;

  // Calculate offset for visible items
  const offsetY = visibleRange.start * itemHeight;

  // Get visible items
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  return (
    <div 
      className="overflow-y-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ 
          transform: `translateY(${offsetY}px)`,
          position: 'absolute',
          width: '100%'
        }}>
          {visibleItems.map((item, index) => (
            <div 
              key={item.id || index} 
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedList;