const CustomFeed = require('../models/customFeed.model');
const Post = require('../models/post.model');
const {fetchPostsWithStats} =require('../controllers/post.controller');
const mongoose = require('mongoose');

// 1. Create a new Custom Feed
const createFeed = async (req, res) => {
  try {
    const { name, description, communities } = req.body;

    const feed = await CustomFeed.create({
      name,
      description,
      user: req.userId, // Owner
      communities: communities || [] // Array of Community IDs
    });

    res.status(201).json({ status: 'success', data: { feed } });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 'fail', message: 'You already have a feed with this name.' });
    }
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// 2. Get All Feeds for the User (Sidebar List)
const getMyFeeds = async (req, res) => {
  try {
    const feeds = await CustomFeed.find({ user: req.userId }).select('name communities');
    res.status(200).json({ status: 'success', results: feeds.length, data: { feeds } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. Get Feed Metadata (Communities inside it)
const getFeed = async (req, res) => {
  try {
    const feed = await CustomFeed.findById(req.params.id).populate('communities', 'name icon');
    if (!feed) return res.status(404).json({ status: 'fail', message: 'Feed not found' });
    
    res.status(200).json({ status: 'success', data: { feed } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 4. Update Feed (Add/Remove communities)
const updateFeed = async (req, res) => {
  try {
    const { name, description, communities } = req.body;
    
    const feed = await CustomFeed.findOneAndUpdate(
      { _id: req.params.id, user: req.userId }, // Ensure ownership
      { name, description, communities },
      { new: true, runValidators: true }
    );

    if (!feed) return res.status(404).json({ status: 'fail', message: 'Feed not found or unauthorized' });

    res.status(200).json({ status: 'success', data: { feed } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// 5. Delete Feed
const deleteFeed = async (req, res) => {
  try {
    const feed = await CustomFeed.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!feed) return res.status(404).json({ status: 'fail', message: 'Feed not found or unauthorized' });

    res.status(200).json({ status: 'success', message: 'Feed deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 6. GET POSTS FOR THIS FEED (The Core Feature)
const getFeedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 1. Get the Feed Definition
    const feed = await CustomFeed.findById(req.params.id);
    if (!feed) return res.status(404).json({  status: 'fail', message: 'Feed not found'  });

    // 2. Build Query using the IDs from the feed
    const query = { community: { $in: feed.communities } };

    // 3. REUSE THE HELPER
    const { posts, totalPosts } = await fetchPostsWithStats(query, page, limit, req.userId);

    res.status(200).json({
      status: 'success',
      page,
      limit,
      totalPosts,
      data: { posts }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


module.exports = { createFeed, getMyFeeds, getFeed, updateFeed, deleteFeed, getFeedPosts };