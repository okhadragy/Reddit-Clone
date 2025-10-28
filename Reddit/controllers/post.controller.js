const Post = require('../models/post.model');
const User = require('../models/user.model');
const Community = require('../models/community.model');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const validator = require('validator');

const deleteUploadedFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '../uploads/posts', filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

// -------------------- Create Post --------------------
const createPost = async (req, res) => {
  const uploadedFiles = req.files?.map(f => f.filename) || [];
  try {
    const { title, content, mediaType, link, community: communityId, flair, tags, isDraft } = req.body;
    const author = req.userId;

    if (!title || !communityId) {
      uploadedFiles.forEach(deleteUploadedFile);
      return res.status(400).json({ status: 'fail', message: 'Title and community are required' });
    }

    const community = await Community.findById(communityId);
    if (!community) {
      uploadedFiles.forEach(deleteUploadedFile);
      return res.status(404).json({ status: 'fail', message: 'Community not found' });
    }

    if (!community.allowedPostTypes.includes(mediaType || 'text')) {
      uploadedFiles.forEach(deleteUploadedFile);
      return res.status(400).json({ status: 'fail', message: `This community doesn’t allow "${mediaType}" posts.` });
    }

    if (link && !validator.isURL(link)) {
      uploadedFiles.forEach(deleteUploadedFile);
      return res.status(400).json({ status: 'fail', message: 'Invalid link URL' });
    }

    let mediaFiles = [];
    if (mediaType === 'image') {
      mediaFiles = req.files?.filter(f => f.mimetype.startsWith('image/')).map(f => f.filename) || [];
      const invalidFiles = req.files?.filter(f => !f.mimetype.startsWith('image/')) || [];
      invalidFiles.forEach(f => deleteUploadedFile(f.filename));
      if (invalidFiles.length > 0) {
        return res.status(400).json({ status: 'fail', message: 'Only image files are allowed for this post type' });
      }
    } else if (mediaType === 'media') {
      mediaFiles = req.files?.filter(f => f.mimetype.startsWith('video/') || f.mimetype.startsWith('image/')).map(f => f.filename) || [];
      const invalidFiles = req.files?.filter(f => !f.mimetype.startsWith('video/') && !f.mimetype.startsWith('image/')) || [];
      invalidFiles.forEach(f => deleteUploadedFile(f.filename));
      if (invalidFiles.length > 0) {
        return res.status(400).json({ status: 'fail', message: 'Only video or image files are allowed for this post type' });
      }
    } else {
      uploadedFiles.forEach(deleteUploadedFile);
    }

    const newPost = await Post.create({
      title,
      content,
      mediaType: mediaType || 'text',
      media: uploadedFiles,
      link,
      community: communityId,
      flair,
      tags,
      author,
      isDraft: isDraft === 'true' || isDraft === true,
    });

    await User.findByIdAndUpdate(author, { $push: { posts: newPost._id } });
    res.status(201).json({ status: 'success', data: { post: newPost } });
  } catch (error) {
    uploadedFiles.forEach(deleteUploadedFile);
    console.error('Error creating post:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// -------------------- Get All Posts --------------------
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .populate('author', 'name photo')
      .populate('community', 'name coverImage')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name photo' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    // Include upvotes/downvotes count for posts
    const postsWithVotes = posts.map(post => ({
      ...post.toObject(),
      upvotesCount: post.upvotes.length,
      downvotesCount: post.downvotes.length,
      comments: post.comments.map(c => ({
        ...c.toObject(),
        upvotesCount: c.upvotes?.length || 0,
        downvotesCount: c.downvotes?.length || 0
      }))
    }));

    res.status(200).json({
      status: 'success',
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      data: { posts: postsWithVotes },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// -------------------- Get Single Post --------------------
const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ status: 'fail', message: 'Invalid Post ID' });

    const post = await Post.findById(id)
      .populate('author', 'name photo')
      .populate('community', 'name coverImage')
      .populate({
        path: 'comments',
        populate: [
          { path: 'user', select: 'name photo' },
          { path: 'parentComment', select: 'text user' },
        ]
      })
      .select('-__v');

    if (!post) return res.status(404).json({ status: 'fail', message: 'Post not found' });

    const postWithVotes = {
      ...post.toObject(),
      upvotesCount: post.upvotes.length,
      downvotesCount: post.downvotes.length,
      comments: post.comments.map(c => ({
        ...c.toObject(),
        upvotesCount: c.upvotes?.length || 0,
        downvotesCount: c.downvotes?.length || 0
      }))
    };

    res.status(200).json({ status: 'success', data: { post: postWithVotes } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// -------------------- Vote Post --------------------
const votePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const userId = req.userId;

    if (!['up', 'down'].includes(action)) return res.status(400).json({ status: 'fail', message: 'Invalid action' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ status: 'fail', message: 'Post not found' });

    post.upvotes.pull(userId);
    post.downvotes.pull(userId);
    if (action === 'up') post.upvotes.push(userId);
    if (action === 'down') post.downvotes.push(userId);

    await post.save();

    res.status(200).json({
      status: 'success',
      data: { upvotesCount: post.upvotes.length, downvotesCount: post.downvotes.length }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  votePost,
};
