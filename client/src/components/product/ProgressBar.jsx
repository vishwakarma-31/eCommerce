import React from 'react';

const ProgressBar = ({ current, total, label = '' }) => {
  const percentage = Math.min(100, Math.round((current / total) * 100));
  
  return (
    <div>
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{current} / {total} {label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-primary-gradient h-2.5 rounded-full transition-all duration-700 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;