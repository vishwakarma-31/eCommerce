const express = require('express');
const {
  getReferralCode,
  getReferralStats,
  processReferral
} = require('../controllers/referral');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/code')
  .get(getReferralCode);

router.route('/stats')
  .get(getReferralStats);

router.route('/process')
  .post(processReferral);

module.exports = router;