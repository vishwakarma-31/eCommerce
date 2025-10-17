import React, { createContext, useState, useContext, useEffect } from 'react';

const ComparisonContext = createContext();

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

export const ComparisonProvider = ({ children }) => {
  const [comparisonItems, setComparisonItems] = useState([]);

  // Load comparison items from localStorage on initial render
  useEffect(() => {
    const savedComparison = localStorage.getItem('productComparison');
    if (savedComparison) {
      try {
        setComparisonItems(JSON.parse(savedComparison));
      } catch (error) {
        console.error('Failed to parse comparison items from localStorage:', error);
        localStorage.removeItem('productComparison');
      }
    }
  }, []);

  // Save comparison items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('productComparison', JSON.stringify(comparisonItems));
  }, [comparisonItems]);

  const addToComparison = (product) => {
    // Check if product is already in comparison
    if (comparisonItems.some(item => item._id === product._id)) {
      return false; // Already in comparison
    }
    
    // Limit to 4 products for comparison
    if (comparisonItems.length >= 4) {
      return false; // Limit reached
    }
    
    setComparisonItems(prev => [...prev, product]);
    return true;
  };

  const removeFromComparison = (productId) => {
    setComparisonItems(prev => prev.filter(item => item._id !== productId));
  };

  const clearComparison = () => {
    setComparisonItems([]);
  };

  const isInComparison = (productId) => {
    return comparisonItems.some(item => item._id === productId);
  };

  const value = {
    comparisonItems,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};

export default ComparisonContext;