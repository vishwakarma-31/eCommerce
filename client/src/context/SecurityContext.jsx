import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/**
 * Security Context
 * Manages security-related state and functions
 */
const SecurityContext = createContext();

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export const SecurityProvider = ({ children }) => {
  const [isCSRFProtected, setIsCSRFProtected] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isSessionActive, setIsSessionActive] = useState(true);

  // Update last activity on user interaction
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const updateActivity = () => {
      setLastActivity(Date.now());
    };
    
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  // Check session activity periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;
      
      // Warn user after 25 minutes of inactivity (5 minutes before timeout)
      if (inactiveTime > 25 * 60 * 1000 && isSessionActive) {
        toast.warn('You will be logged out soon due to inactivity. Please take action to continue.', {
          autoClose: 60000,
          toastId: 'session-warning'
        });
      }
      
      // Logout after 30 minutes of inactivity
      if (inactiveTime > 30 * 60 * 1000 && isSessionActive) {
        toast.error('Logged out due to inactivity.', {
          toastId: 'session-expired'
        });
        
        // Clear user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        setIsSessionActive(false);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [lastActivity, isSessionActive]);

  // Enable CSRF protection
  const enableCSRFProtection = () => {
    setIsCSRFProtected(true);
  };

  // Disable CSRF protection
  const disableCSRFProtection = () => {
    setIsCSRFProtected(false);
  };

  // Reset session activity
  const resetSessionActivity = () => {
    setLastActivity(Date.now());
    setIsSessionActive(true);
  };

  const value = {
    isCSRFProtected,
    enableCSRFProtection,
    disableCSRFProtection,
    lastActivity,
    isSessionActive,
    resetSessionActivity
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export default SecurityContext;