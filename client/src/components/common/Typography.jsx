import React from 'react';

const Typography = ({ 
  children, 
  variant = 'body', 
  component, 
  className = '', 
  color = 'primary', 
  align = 'left', 
  ...props 
}) => {
  const variantMap = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-bold',
    h3: 'text-2xl font-bold',
    h4: 'text-xl font-semibold',
    h5: 'text-lg font-semibold',
    h6: 'text-base font-semibold',
    subtitle1: 'text-lg font-medium',
    subtitle2: 'text-base font-medium',
    body: 'text-base font-normal',
    body2: 'text-sm font-normal',
    caption: 'text-xs font-normal',
    overline: 'text-xs font-bold uppercase',
  };
  
  const colorMap = {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    light: 'text-text-light',
    success: 'text-success-main',
    warning: 'text-warning-main',
    error: 'text-error-main',
    primaryGradient: 'bg-primary-gradient bg-clip-text text-transparent',
  };
  
  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };
  
  const Component = component || (variant.startsWith('h') ? variant : 'p');
  
  const classes = `${variantMap[variant]} ${colorMap[color]} ${alignMap[align]} ${className}`;
  
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Typography;