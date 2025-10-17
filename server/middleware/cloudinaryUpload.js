const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary storage with optimized settings
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'launchpad-market/products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' }, // Auto format (WebP when possible)
      { dpr: 'auto' } // Auto device pixel ratio
    ]
  }
});

// Configure thumbnail storage for smaller images
const thumbnailStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'launchpad-market/products/thumbnails',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { width: 300, height: 300, crop: 'thumb', gravity: 'auto' },
      { quality: 'auto:eco', fetch_format: 'auto' }, // Eco quality for thumbnails
      { dpr: 'auto' }
    ]
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Multer upload middleware for product images
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Multer upload middleware for thumbnails
const uploadThumbnail = multer({
  storage: thumbnailStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit for thumbnails
  }
});

// Function to generate responsive image URLs
const generateResponsiveImageUrls = (publicId) => {
  return {
    small: cloudinary.url(publicId, {
      width: 300,
      height: 300,
      crop: 'thumb',
      gravity: 'auto',
      quality: 'auto:eco',
      fetch_format: 'auto'
    }),
    medium: cloudinary.url(publicId, {
      width: 600,
      height: 600,
      crop: 'limit',
      quality: 'auto:good',
      fetch_format: 'auto'
    }),
    large: cloudinary.url(publicId, {
      width: 1200,
      height: 1200,
      crop: 'limit',
      quality: 'auto',
      fetch_format: 'auto'
    }),
    original: cloudinary.url(publicId, {
      quality: 'auto',
      fetch_format: 'auto'
    })
  };
};

module.exports = {
  upload,
  uploadThumbnail,
  generateResponsiveImageUrls
};