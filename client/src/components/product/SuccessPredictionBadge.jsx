import React from 'react';

const SuccessPredictionBadge = ({ probability, size = 'md' }) => {
  const getPredictionLevel = () => {
    if (probability >= 80) return { level: 'High', color: 'bg-green-100 text-green-800', icon: '🟢' };
    if (probability >= 60) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' };
    if (probability >= 40) return { level: 'Low', color: 'bg-orange-100 text-orange-800', icon: '🟠' };
    return { level: 'Very Low', color: 'bg-red-100 text-red-800', icon: '🔴' };
  };

  const { level, color, icon } = getPredictionLevel();
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <div className="inline-flex items-center">
      <span className={`inline-flex items-center rounded-full font-medium ${color} ${sizeClasses[size]}`}>
        <span className="mr-1">{icon}</span>
        {level} Chance ({probability}%)
      </span>
      <div className="group relative ml-2">
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <p className="text-sm text-gray-600">
            Our algorithm predicts the likelihood of this project reaching its funding goal based on factors like creator history, product category, funding progress, and community engagement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPredictionBadge;