const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
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
const notificationRoutes = require('./routes/notifications');
const followingRoutes = require('./routes/following');
const referralRoutes = require('./routes/referral');
const comparisonRoutes = require('./routes/comparison');
const moderationRoutes = require('./routes/moderation'); // Add moderation routes
const successMetricsRoutes = require('./routes/successMetrics'); // Add success metrics routes
const searchRoutes = require('./routes/search'); // Add search routes
const performanceRoutes = require('./routes/performance'); // Add performance routes
const recommendationRoutes = require('./routes/recommendations'); // Add recommendation routes

// Import socket module
const { initializeSocket } = require('./socket');

// Import services
const { startAllCronJobs } = require('./services/cronService');

// Import security middleware
const { loginLimiter, registerLimiter, apiLimiter, sanitizeInput, validatePassword } = require('./middleware/security');

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

// Apply general API rate limiting
app.use('/api/', apiLimiter);

// Security headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Enable CORS with specific origin
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Logging
app.use(morgan('combined'));

// Parse JSON bodies
app.use(express.json());

// Sanitize data to prevent MongoDB operator injection
app.use(mongoSanitize());

// XSS sanitization middleware
app.use(sanitizeInput);

// Add compression middleware for API responses
app.use(compression());

// Session middleware with secure settings and timeout
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'launchpadmarket_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Secure in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: 30 * 60 * 1000 // 30 minutes session timeout
  }
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
app.use('/api/notifications', notificationRoutes);
app.use('/api/following', followingRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/compare', comparisonRoutes);
app.use('/api/search', searchRoutes); // Add search routes
app.use('/api/performance', performanceRoutes); // Add performance routes
app.use('/api/recommendations', recommendationRoutes); // Add recommendation routes

// Health check endpoint with performance metrics
app.get('/health', (req, res) => {
  const { performanceMonitor } = require('./utils/performanceMonitor');
  const metrics = performanceMonitor.getMetrics();
  
  res.status(200).json({ 
    status: 'OK', 
    message: 'LaunchPad Market API is running',
    performance: metrics
  });
});

// Test cron jobs endpoint (only in development)
if (process.env.NODE_ENV === 'development') {
  const { testAllCronJobs } = require('./services/cronService');
  
  app.post('/test/cron-jobs', async (req, res) => {
    try {
      await testAllCronJobs();
      res.status(200).json({ status: 'OK', message: 'All cron jobs executed successfully' });
    } catch (error) {
      console.error('Error testing cron jobs:', error);
      res.status(500).json({ status: 'ERROR', message: 'Failed to execute cron jobs', error: error.message });
    }
  });
}

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Catch-all handler for React Router
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server!`);
  error.statusCode = 404;
  next(error);
});

// Global error handling middleware
app.use(require('./middleware/errorMiddleware').errorHandler);

let server;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/launchpadmarket')
  .then(() => {
    logger.info('Connected to MongoDB');
    
    // Start all cron services
    startAllCronJobs();
    logger.info('All cron jobs started');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    
    // Check if HTTPS is enabled
    if (process.env.HTTPS === 'true') {
      // HTTPS configuration
      const sslOptions = {
        key: process.env.SSL_KEY_PATH ? fs.readFileSync(process.env.SSL_KEY_PATH) : null,
        cert: process.env.SSL_CERT_PATH ? fs.readFileSync(process.env.SSL_CERT_PATH) : null
      };
      
      if (sslOptions.key && sslOptions.cert) {
        server = https.createServer(sslOptions, app).listen(PORT, () => {
          logger.info(`HTTPS Server running on port ${PORT}`);
        });
      } else {
        logger.warn('HTTPS enabled but certificate files not found. Starting HTTP server instead.');
        server = app.listen(PORT, () => {
          logger.info(`HTTP Server running on port ${PORT}`);
        });
      }
    } else {
      // HTTP configuration
      server = app.listen(PORT, () => {
        logger.info(`HTTP Server running on port ${PORT}`);
      });
    }
    
    // Initialize Socket.io
    const io = initializeSocket(server);
    logger.info('Socket.io initialized');
  })
  .catch((error) => {
    logger.error('Connection error', error.message);
    logger.error('Please check your MONGO_URI in the .env file. For MongoDB Atlas, make sure to replace the placeholder credentials with your actual MongoDB Atlas credentials.');
  });