import React, { useState, useRef, useEffect } from 'react';
import LazyImage from '../common/LazyImage';

const SwipeableImageGallery = ({ images, onImageSelect, selectedImageIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(selectedImageIndex || 0);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const galleryRef = useRef(null);

  // Update current index when selectedImageIndex changes
  useEffect(() => {
    setCurrentIndex(selectedImageIndex || 0);
  }, [selectedImageIndex]);

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
    
    if (diff > threshold && currentIndex < images.length - 1) {
      // Swipe left - next image
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      if (onImageSelect) onImageSelect(newIndex);
    } else if (diff < -threshold && currentIndex > 0) {
      // Swipe right - previous image
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      if (onImageSelect) onImageSelect(newIndex);
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
    
    if (diff > threshold && currentIndex < images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      if (onImageSelect) onImageSelect(newIndex);
    } else if (diff < -threshold && currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      if (onImageSelect) onImageSelect(newIndex);
    }
    
    setIsDragging(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Image */}
      <div 
        ref={galleryRef}
        className="bg-gray-200 rounded-lg overflow-hidden aspect-square flex items-center justify-center relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <LazyImage 
          src={images[currentIndex]} 
          alt={`Product image ${currentIndex + 1}`} 
          className="w-full h-full object-cover"
        />
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                if (onImageSelect) onImageSelect(index);
              }}
              className={`bg-gray-200 rounded overflow-hidden aspect-square border-2 ${
                currentIndex === index ? 'border-indigo-500' : 'border-transparent'
              }`}
            >
              <LazyImage 
                src={image} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SwipeableImageGallery;