import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default', 
  hoverable = true, 
  ...props 
}) => {
  const baseClasses = 'rounded-xl bg-white shadow-lg overflow-hidden transition-all duration-300 ease-in-out';
  
  const variantClasses = {
    default: 'p-6',
    compact: 'p-4',
    elevated: 'p-6 shadow-xl',
  };
  
  const hoverClasses = hoverable 
    ? 'hover:shadow-xl transform hover:-translate-y-1' 
    : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;