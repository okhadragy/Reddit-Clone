const express = require('express');
const feedController = require('../controllers/customFeeds.controller');
const { protectRoutes } = require('../middleware/auth');

const router = express.Router();

// Apply protection to everything (Custom feeds are private user features)
router.use(protectRoutes);

router.route('/')
  .get(feedController.getMyFeeds)   // Get list for sidebar
  .post(feedController.createFeed); // Create new

router.route('/:id')
  .get(feedController.getFeed)      // Get metadata (description, included subs)
  .patch(feedController.updateFeed) // Edit
  .delete(feedController.deleteFeed);

// The route to actually view the content
router.get('/:id/posts', feedController.getFeedPosts);

module.exports = router;