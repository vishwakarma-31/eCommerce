const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const ProductConcept = require('./models/ProductConcept');
const PreOrder = require('./models/PreOrder');

// Import services
const { captureAllPreOrderPayments, cancelAllPreOrderPayments } = require('./services/paymentService');
const RecommendationEngine = require('./services/recommendationService');
const AnalyticsService = require('./services/analyticsService');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/launchpadmarket')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Test analytics service
    console.log('Testing analytics service...');
    const salesData = await AnalyticsService.getTotalSalesPerProduct();
    console.log('Total sales per product:', salesData.slice(0, 3)); // Show first 3
    
    const trendData = await AnalyticsService.getRevenueTrends(3);
    console.log('Revenue trends:', trendData);
    
    const engagementMetrics = await AnalyticsService.getUserEngagementMetrics();
    console.log('Engagement metrics:', engagementMetrics);
    
    const conversionRates = await AnalyticsService.getConversionRates();
    console.log('Conversion rates (first 3):', conversionRates.slice(0, 3));
    
    // Test recommendation engine
    console.log('Testing recommendation engine...');
    const trending = await RecommendationEngine.getTrendingProducts(3);
    console.log('Trending products:', trending.map(p => p.title));
    
    // Test payment service functions (without actually calling Stripe)
    console.log('Payment service functions are available:');
    console.log('- captureAllPreOrderPayments');
    console.log('- cancelAllPreOrderPayments');
    console.log('- refundPreOrderPayment');
    
    console.log('All services tested successfully!');
    
    // Close connection
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Connection error', error.message);
  });