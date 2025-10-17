import React, { useState, useRef, useEffect } from 'react';

/**
 * Responsive Image Component
 * Supports lazy loading, responsive images, and WebP format when available
 */
const ResponsiveImage = ({ 
  src, 
  alt, 
  className = '', 
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  breakpoints = [300, 600, 1200],
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
        rootMargin: '100px' // Load images when they're 100px away from viewport
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

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (!src) return '';
    
    // If it's a Cloudinary URL, generate different sizes
    if (src.includes('cloudinary')) {
      return breakpoints.map(size => {
        const url = new URL(src);
        url.searchParams.set('w', size);
        url.searchParams.set('q', 'auto');
        url.searchParams.set('f', 'auto');
        return `${url.toString()} ${size}w`;
      }).join(', ');
    }
    
    // For other URLs, just return the original
    return src;
  };

  // Generate sizes attribute
  const sizesAttr = sizes;

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isInView && src && (
        <img
          src={src}
          srcSet={generateSrcSet()}
          sizes={sizesAttr}
          alt={alt}
          onLoad={handleLoad}
          className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${className}`}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
      
      {!isLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
          {placeholder || (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;