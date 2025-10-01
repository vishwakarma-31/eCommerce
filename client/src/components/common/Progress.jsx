import React from 'react';

const Progress = ({ 
  value, 
  max = 100, 
  label, 
  showPercentage = true, 
  color = 'primary', 
  size = 'md',
  animated = true,
  className = ''
}) => {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-2.5',
    lg: 'h-3',
  };
  
  const colorClasses = {
    primary: 'bg-primary-gradient',
    secondary: 'bg-secondary-main',
    success: 'bg-success-main',
    warning: 'bg-warning-main',
    error: 'bg-error-main',
  };
  
  const containerClasses = `w-full bg-gray-200 rounded-full ${sizeClasses[size]} ${className}`;
  const progressClasses = `${colorClasses[color]} rounded-full transition-all duration-700 ease-out ${animated ? 'transition-all duration-700 ease-out' : ''}`;
  
  return (
    <div>
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          {showPercentage && <span>{percentage}%</span>}
        </div>
      )}
      <div className={containerClasses}>
        <div 
          className={progressClasses} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Progress;