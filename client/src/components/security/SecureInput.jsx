import React, { useState } from 'react';
import { sanitizeInput } from '../../utils/security';

/**
 * Secure Input Component
 * Demonstrates proper input sanitization and validation
 */
const SecureInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  placeholder = '',
  validation = null,
  ...props 
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    // Sanitize input
    const sanitizedValue = sanitizeInput(inputValue);
    
    // Validate if validation function is provided
    if (validation && touched) {
      const validationResult = validation(sanitizedValue);
      if (validationResult !== true) {
        setError(validationResult);
      } else {
        setError('');
      }
    }
    
    // Call parent onChange handler
    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          value: sanitizedValue
        }
      });
    }
  };

  const handleBlur = (e) => {
    setTouched(true);
    
    // Validate on blur
    if (validation) {
      const validationResult = validation(e.target.value);
      if (validationResult !== true) {
        setError(validationResult);
      } else {
        setError('');
      }
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
        }`}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SecureInput;