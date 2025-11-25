const Post = require('../models/post.model');
const User = require('../models/user.model');
const Community = require('../models/community.model');
const checkAchievement = require('../utils/achievement.checker');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const validator = require('validator');

const deleteUploadedFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '../uploads/posts', filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};


// --------------------Filter posts Helper---------------------
// --- Reusable Helper Function ---
const fetchPostsWithStats = async (query, page, limit, userId) => {
  const skip = (page - 1) * limit;

  const posts = await Post.find(query)
    .populate('author', 'name photo')
    .populate('community', 'name coverImage icon')
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'name photo' }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-__v');

  const totalPosts = await Post.countDocuments(query);

  // The "Enrichment" Logic (Vote Counts, etc.)
  const postsWithVotes = posts.map(post => ({
    ...post.toObject(),
    upvotesCount: post.upvotes.length,
    downvotesCount: post.downvotes.length,
    // Add user vote status if needed (isUpvoted: post.upvotes.includes(userId))
    comments: post.comments.map(c => ({
      ...c.toObject(),
      upvotesCount: c.upvotes?.length || 0,
      downvotesCount: c.downvotes?.length || 0
    }))
  }));

  return { posts: postsWithVotes, totalPosts };
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

    await User.findByIdAndUpdate(author, { $push: { posts: newPost._id } ,$inc: { postKarma: 1 }});
    await checkAchievement(author, { type: 'post', communityId });
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
    const { type } = req.query;
    let query = {};

    if (type === 'home' && req.userId) {
        const memberships = await CommunityMember.find({ user: req.userId }).select('community');
        const communityIds = memberships.map(m => m.community);
        query = { community: { $in: communityIds } };
    } 
    // 'popular' feed uses empty query {}

    // CALL THE HELPER
    const { posts, totalPosts } = await fetchPostsWithStats(query, page, limit, req.userId);

    res.status(200).json({
      status: 'success',
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      data: { posts },
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

// -------------------- Update Post --------------------
const updatePost = async (req, res) => {
  const uploadedFiles = req.files?.map(f => f.filename) || [];
  try {
    const { id } = req.params;
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ status: 'fail', message: 'Invalid Post ID' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ status: 'fail', message: 'Post not found' });

    if (post.author.toString() !== userId && req.userRole !== 'admin') {
      uploadedFiles.forEach(deleteUploadedFile);
      return res.status(403).json({ status: 'fail', message: 'Not authorized to update this post' });
    }

    const { title, content, mediaType, link, flair, tags, isDraft } = req.body;

    if (mediaType) {
      let mediaFiles = [];
      if (mediaType === 'image') {
        mediaFiles = req.files?.filter(f => f.mimetype.startsWith('image/')).map(f => f.filename) || [];
        const invalidFiles = req.files?.filter(f => !f.mimetype.startsWith('image/')) || [];
        invalidFiles.forEach(f => deleteUploadedFile(f.filename));
        if (invalidFiles.length > 0) return res.status(400).json({ status: 'fail', message: 'Only image files allowed' });
      } else if (mediaType === 'media') {
        mediaFiles = req.files?.filter(f => f.mimetype.startsWith('image/') || f.mimetype.startsWith('video/')).map(f => f.filename) || [];
        const invalidFiles = req.files?.filter(f => !f.mimetype.startsWith('image/') && !f.mimetype.startsWith('video/')) || [];
        invalidFiles.forEach(f => deleteUploadedFile(f.filename));
        if (invalidFiles.length > 0) return res.status(400).json({ status: 'fail', message: 'Only video or image files allowed' });
      } else {
        uploadedFiles.forEach(deleteUploadedFile);
      }

      // delete old media files if new ones are uploaded
      if (mediaFiles.length > 0) post.media.forEach(deleteUploadedFile);
      post.media = mediaFiles.length > 0 ? mediaFiles : post.media;
      post.mediaType = mediaType;
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (link) post.link = link;
    if (flair) post.flair = flair;
    if (tags) post.tags = tags;
    if (typeof isDraft !== 'undefined') post.isDraft = isDraft;

    await post.save();
    res.status(200).json({ status: 'success', data: { post } });
  } catch (error) {
    uploadedFiles.forEach(deleteUploadedFile);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// -------------------- Delete Post --------------------
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ status: 'fail', message: 'Invalid Post ID' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ status: 'fail', message: 'Post not found' });

    if (post.author.toString() !== userId && req.userRole !== 'admin') return res.status(403).json({ status: 'fail', message: 'Not authorized to delete this post' });

    // delete uploaded files
    post.media.forEach(deleteUploadedFile);

    await Post.deleteOne({ _id: id });
    await User.findByIdAndUpdate(post.author, { $pull: { posts: id } });

    res.status(200).json({ status: 'success', message: 'Post deleted successfully' });
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


    const authorId = post.author;
    const wasUpvoted = post.upvotes.includes(userId);
    const wasDownvoted = post.downvotes.includes(userId);

    let oldVoteValue = (wasUpvoted ? 1 : 0) + (wasDownvoted ? -1 : 0);
    let newVoteValue = 0;
    let karmaChange = 0;

    post.upvotes.pull(userId);
    post.downvotes.pull(userId);
    if (action === 'up') {
        post.upvotes.push(userId);
        newVoteValue = 1; 
    } else if (action === 'down') {
        post.downvotes.push(userId);
        newVoteValue = -1;
    } 
    await post.save();
    karmaChange = newVoteValue - oldVoteValue;


    if (karmaChange !== 0) {
      await User.findByIdAndUpdate(authorId, {
          $inc: { postKarma: karmaChange } 
    });
    }
    await checkAchievement(authorId, { type: 'karma' ,communityId: post.community});
    res.status(200).json({
      status: 'success',
      data: { upvotesCount: post.upvotes.length, downvotesCount: post.downvotes.length }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// -------------------- Toggle Save Post --------------------
const toggleSavePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ status: "fail", message: "Post not found" });

    const isSaved = user.savedPosts?.includes(postId);
    if (isSaved) {
      user.savedPosts.pull(postId);
      await user.save();
      return res.status(200).json({ status: "success", message: "Post unsaved" });
    } else {
      user.savedPosts.push(postId);
      await user.save();
      return res.status(200).json({ status: "success", message: "Post saved" });
    }
  } catch (error) {
    console.error("Error in toggleSavePost:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  votePost,
  toggleSavePost,
  fetchPostsWithStats
};
