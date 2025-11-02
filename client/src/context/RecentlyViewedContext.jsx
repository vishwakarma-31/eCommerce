import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const RecentlyViewedContext = createContext();

// Custom hook to use the recently viewed context
export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

// RecentlyViewedProvider component
export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const MAX_RECENTLY_VIEWED = 10; // Limit to 10 items

  // Load recently viewed from localStorage on initial render
  useEffect(() => {
    const savedRecentlyViewed = localStorage.getItem('recentlyViewed');
    if (savedRecentlyViewed) {
      try {
        setRecentlyViewed(JSON.parse(savedRecentlyViewed));
      } catch (error) {
        console.error('Error parsing recently viewed from localStorage:', error);
        localStorage.removeItem('recentlyViewed');
      }
    }
  }, []);

  // Save recently viewed to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prevItems => {
      // Remove the product if it already exists
      const filteredItems = prevItems.filter(item => item._id !== product._id);
      
      // Add the product to the beginning of the array
      const newItems = [product, ...filteredItems];
      
      // Limit to MAX_RECENTLY_VIEWED items
      return newItems.slice(0, MAX_RECENTLY_VIEWED);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  const removeFromRecentlyViewed = (productId) => {
    setRecentlyViewed(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const value = {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
    removeFromRecentlyViewed
  };

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export default RecentlyViewedContext;