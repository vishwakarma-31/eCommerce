const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Configure multer storage as specified in Section 10
const storage = multer.diskStorage({
  destination: './uploads/products/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.random().toString(36).substring(7) + path.extname(file.originalname));
  }
});

// Multer configuration as specified in Section 10
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Function to generate thumbnail
const generateThumbnail = async (originalPath, thumbnailPath, width = 300, height = 300) => {
  try {
    await sharp(originalPath)
      .resize(width, height, { 
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);
    return thumbnailPath;
  } catch (error) {
    throw new Error('Failed to generate thumbnail: ' + error.message);
  }
};

// Middleware to process uploaded images and generate thumbnails
const processImages = async (req, res, next) => {
  if (!req.files && !req.file) {
    return next();
  }

  try {
    const files = req.files || (req.file ? [req.file] : []);
    
    for (const file of files) {
      // Generate thumbnail path
      const ext = path.extname(file.filename);
      const name = path.basename(file.filename, ext);
      const thumbnailPath = path.join('./uploads/products/', `${name}_thumb${ext}`);
      
      // Generate thumbnail
      await generateThumbnail(file.path, thumbnailPath);
      
      // Add thumbnail info to file object
      file.thumbnail = thumbnailPath;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  processImages
};