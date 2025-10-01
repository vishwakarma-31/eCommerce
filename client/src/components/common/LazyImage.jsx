import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px' // Load images when they're 50px away from viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${className}`}
          {...props}
        />
      )}
      
      {!isLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
          {placeholder || (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
          )}
        </div>
      )}
    </div>
  );
};

export default LazyImage;