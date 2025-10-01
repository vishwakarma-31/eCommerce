const express = require('express');
const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowingFeed
} = require('../controllers/following');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getFollowing);

router.route('/feed')
  .get(getFollowingFeed);

router.route('/:id')
  .post(followUser)
  .delete(unfollowUser);

module.exports = router;