import React from 'react';

const CheckoutProgressBar = ({ currentStep, totalSteps, stepTitles }) => {
  return (
    <div className="hidden md:block">
      <div className="flex items-center justify-between">
        {[...Array(totalSteps)].map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-indigo-600 text-white border-2 border-indigo-600' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="mt-2 text-sm font-medium text-gray-900">
                  {stepTitles[index]}
                </div>
              </div>
              
              {stepNumber < totalSteps && (
                <div className={`flex-auto h-1 ${
                  stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutProgressBar;