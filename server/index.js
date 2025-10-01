const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression'); // Add compression middleware
const fs = require('fs').promises;
const path = require('path');
const logger = require('./utils/logger');
require('dotenv').config();

// Ensure logs directory exists
const ensureLogsDirectory = async () => {
  const logsDir = path.join(__dirname, 'logs');
  try {
    await fs.access(logsDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(logsDir, { recursive: true });
      logger.info('Created logs directory:', logsDir);
    } else {
      logger.error('Error accessing logs directory:', error);
      throw error;
    }
  }
};

// Import routes
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const preorderRoutes = require('./routes/preorders');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const reviewRoutes = require('./routes/reviews');
const commentRoutes = require('./routes/comments');
const categoryRoutes = require('./routes/categories');
const creatorRoutes = require('./routes/creator');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const stripeRoutes = require('./routes/stripe');
const notificationRoutes = require('./routes/notifications');
const followingRoutes = require('./routes/following');
const referralRoutes = require('./routes/referral');
const comparisonRoutes = require('./routes/comparison');
const moderationRoutes = require('./routes/moderation'); // Add moderation routes
const successMetricsRoutes = require('./routes/successMetrics'); // Add success metrics routes

// Import services
const { startDeadlineChecker } = require('./services/cronService');

// Import security middleware
const { loginLimiter, registerLimiter, sanitizeInput } = require('./middleware/security');

// Import error handling middleware
const globalErrorHandler = require('./middleware/errorHandler');

// Import multer for file upload errors
const multer = require('multer');

// Ensure uploads directory exists
const ensureUploadsDirectory = async () => {
  const uploadsDir = path.join(__dirname, 'uploads', 'products');
  try {
    await fs.access(uploadsDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(uploadsDir, { recursive: true });
      logger.info('Created uploads directory:', uploadsDir);
    } else {
      logger.error('Error accessing uploads directory:', error);
      throw error;
    }
  }
};

// Create Express app
const app = express();

// Ensure logs directory exists
ensureLogsDirectory().catch((error) => {
  logger.error('Failed to ensure logs directory exists:', error);
});

// Ensure uploads directory exists on startup
ensureUploadsDirectory().catch((error) => {
  logger.error('Failed to ensure uploads directory exists:', error);
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all requests
app.use(limiter);

// Apply auth rate limiting to auth routes
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', registerLimiter);

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
})); // Enable CORS with specific origin
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(mongoSanitize()); // Sanitize data to prevent MongoDB operator injection
app.use(sanitizeInput); // XSS sanitization middleware
app.use(compression()); // Add compression middleware for API responses

// Session middleware for comparison feature
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'launchpadmarket_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/preorders', preorderRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/moderation', moderationRoutes); // Add moderation routes
app.use('/api', analyticsRoutes);
app.use('/api/metrics', successMetricsRoutes); // Add success metrics routes
app.use('/api/stripe', stripeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/following', followingRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/compare', comparisonRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'LaunchPad Market API is running' });
});

// 404 handler
app.use('*', (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server!`);
  error.statusCode = 404;
  next(error);
});

// Global error handling middleware
app.use(require('./middleware/errorMiddleware').errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/launchpadmarket')
  .then(() => {
    logger.info('Connected to MongoDB');
    
    // Start cron services
    startDeadlineChecker();
    logger.info('Cron services started');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Connection error', error.message);
  });