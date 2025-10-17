const express = require('express');
const router = express.Router();
const { handlePayPalWebhook } = require('../controllers/paypalWebhook');

// PayPal webhook endpoint (no auth middleware as it needs to be publicly accessible)
router.post('/webhook', express.json(), handlePayPalWebhook);

module.exports = router;