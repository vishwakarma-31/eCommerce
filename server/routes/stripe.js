const express = require('express');
const router = express.Router();
const { handleStripeWebhook } = require('../controllers/stripeWebhook');

// Stripe webhook endpoint (no auth middleware as it needs to be publicly accessible)
router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

module.exports = router;