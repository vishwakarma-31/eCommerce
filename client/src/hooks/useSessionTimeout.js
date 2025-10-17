import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * Session Timeout Hook
 * Handles automatic logout after a period of inactivity
 */
const useSessionTimeout = (timeoutMinutes = 30) => {
  const [timeoutId, setTimeoutId] = useState(null);
  const [warningTimeoutId, setWarningTimeoutId] = useState(null);
  const navigate = useNavigate();

  // Reset timeout timer
  const resetTimeout = useCallback(() => {
    // Clear existing timeouts
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (warningTimeoutId) {
      clearTimeout(warningTimeoutId);
    }

    // Set warning timeout (5 minutes before actual timeout)
    const warningTime = (timeoutMinutes - 5) * 60 * 1000;
    const warningId = setTimeout(() => {
      toast.warn('Your session will expire in 5 minutes due to inactivity. Please take action to continue.', {
        autoClose: 60000, // Show for 1 minute
        onClose: () => {
          // Reset timeout if user interacts with toast
          resetTimeout();
        }
      });
    }, warningTime);
    
    setWarningTimeoutId(warningId);

    // Set actual timeout
    const timeoutDuration = timeoutMinutes * 60 * 1000;
    const id = setTimeout(() => {
      // Session expired, logout user
      toast.error('Session expired due to inactivity. Please log in again.');
      
      // Clear user data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login
      navigate('/login');
    }, timeoutDuration);
    
    setTimeoutId(id);
  }, [timeoutId, warningTimeoutId, timeoutMinutes, navigate]);

  // Initialize timeout
  useEffect(() => {
    resetTimeout();
    
    // Reset timeout on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const resetTimeoutHandler = () => resetTimeout();
    
    events.forEach(event => {
      window.addEventListener(event, resetTimeoutHandler);
    });
    
    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimeoutHandler);
      });
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (warningTimeoutId) {
        clearTimeout(warningTimeoutId);
      }
    };
  }, [resetTimeout, timeoutId, warningTimeoutId]);

  return { resetTimeout };
};

export default useSessionTimeout;