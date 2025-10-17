const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./auth');
const userRoutes = require('./users');
const productRoutes = require('./products');
const preorderRoutes = require('./preorders');
const orderRoutes = require('./orders');
const cartRoutes = require('./cart');
const reviewRoutes = require('./reviews');
const commentRoutes = require('./comments');
const categoryRoutes = require('./categories');
const creatorRoutes = require('./creator');
const adminRoutes = require('./admin');
const stripeRoutes = require('./stripe');
const paypalRoutes = require('./paypal');

// Use all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/preorders', preorderRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/reviews', reviewRoutes);
router.use('/comments', commentRoutes);
router.use('/categories', categoryRoutes);
router.use('/creator', creatorRoutes);
router.use('/admin', adminRoutes);
router.use('/stripe', stripeRoutes);
router.use('/paypal', paypalRoutes);

module.exports = router;