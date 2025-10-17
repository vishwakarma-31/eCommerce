import React, { useState, useEffect } from 'react';
import { generateCSRFToken, validateCSRFToken } from '../../utils/security';

/**
 * Secure Form Component
 * Demonstrates proper form handling with CSRF protection
 */
const SecureForm = ({ 
  onSubmit, 
  children, 
  className = '', 
  ...props 
}) => {
  const [csrfToken, setCsrfToken] = useState('');

  // Generate CSRF token on component mount
  useEffect(() => {
    const token = generateCSRFToken();
    setCsrfToken(token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate CSRF token
    if (!validateCSRFToken(csrfToken)) {
      console.error('Invalid CSRF token');
      return;
    }
    
    // Call parent onSubmit handler
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={className}
      {...props}
    >
      {/* Hidden CSRF token field */}
      <input 
        type="hidden" 
        name="_csrf" 
        value={csrfToken} 
      />
      
      {children}
    </form>
  );
};

export default SecureForm;