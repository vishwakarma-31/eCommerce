import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../common/LazyImage';

const TouchCarousel = ({ products, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef(null);

  // Handle touch start
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setEndX(e.touches[0].clientX);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = startX - endX;
    const threshold = 50; // Minimum swipe distance
    
    if (diff > threshold && currentIndex < products.length - 1) {
      // Swipe left - next slide
      setCurrentIndex(prev => prev + 1);
    } else if (diff < -threshold && currentIndex > 0) {
      // Swipe right - previous slide
      setCurrentIndex(prev => prev - 1);
    }
    
    setIsDragging(false);
  };

  // Handle mouse events for desktop
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setEndX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diff = startX - endX;
    const threshold = 50;
    
    if (diff > threshold && currentIndex < products.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (diff < -threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
    
    setIsDragging(false);
  };

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (products.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => 
        prev === products.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length]);

  if (!products || products.length === 0) return null;

  return (
    <div className="relative group">
      {title && (
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      )}
      
      <div 
        ref={carouselRef}
        className="relative overflow-hidden rounded-xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          {products.map((product) => (
            <div 
              key={product._id} 
              className="w-full flex-shrink-0 relative"
            >
              <Link to={`/product/${product._id}`} className="block">
                <div className="relative h-64 sm:h-80">
                  {product.images && product.images.length > 0 ? (
                    <LazyImage
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-bold mb-1 truncate">{product.title}</h3>
                    <p className="text-gray-200 text-sm mb-2 line-clamp-2">{product.shortDescription || product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold">${product.price?.toFixed(2)}</span>
                      {product.discountPrice && product.discountPrice < product.price && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows for desktop */}
      <button
        onClick={() => setCurrentIndex(prev => 
          prev === 0 ? products.length - 1 : prev - 1
        )}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity sm:block hidden"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => setCurrentIndex(prev => 
          prev === products.length - 1 ? 0 : prev + 1
        )}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity sm:block hidden"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TouchCarousel;