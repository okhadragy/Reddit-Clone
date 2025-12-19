const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const checkAchievement = require('../utils/achievement.checker');
const mongoose = require('mongoose');

// -------------------- Add Comment or Reply --------------------
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, parentComment } = req.body;
    const userId = req.userId;

    if (!text) 
      return res.status(400).json({ status: 'fail', message: 'Comment text is required' });

    const post = await Post.findById(postId);
    if (!post) 
      return res.status(404).json({ status: 'fail', message: 'Post not found' });

    // Create the comment
    const comment = await Comment.create({
      post: postId,
      user: userId,
      text,
      parentComment: parentComment || null,
    });

    // Update user and post references
    await User.findByIdAndUpdate(userId, { $push: { comments: comment._id } });
    post.comments.push(comment._id);
    await post.save();

    await checkAchievement(userId, { type: 'comment', communityId: post.community });

    // Populate user and parentComment
    const populated = await Comment.findById(comment._id)
      .populate('user', 'name photo')
      .populate('parentComment', 'text user');

    // Prepare response with votes info
    const commentObj = populated.toObject();
    const upvotesCount = populated.upvotes?.length || 0;
    const downvotesCount = populated.downvotes?.length || 0;
    const userVote = userId
      ? populated.upvotes?.includes(userId)
        ? 1
        : populated.downvotes?.includes(userId)
          ? -1
          : 0
      : 0;

    res.status(201).json({ 
      status: 'success', 
      data: { 
        comment: {
          ...commentObj,
          upvotesCount,
          downvotesCount,
          userVote
        } 
      } 
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


// -------------------- Update Comment --------------------
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ status: 'fail', message: 'Comment not found' });

    if (comment.user.toString() !== userId && req.userRole !== 'admin')
      return res.status(403).json({ status: 'fail', message: 'Not authorized' });

    comment.text = text;
    await comment.save();

    res.status(200).json({ status: 'success', data: { comment } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// -------------------- Delete Comment --------------------
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ status: 'fail', message: 'Comment not found' });

    if (comment.user.toString() !== userId && req.userRole !== 'admin')
      return res.status(403).json({ status: 'fail', message: 'Not authorized' });

    await Comment.deleteMany({ parentComment: commentId }); // delete replies
    await comment.deleteOne();
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: commentId } });

    res.status(200).json({ status: 'success', message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// -------------------- Vote Comment --------------------
const voteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { action } = req.body;
    const userId = req.userId;

    if (!['up', 'down'].includes(action))
      return res.status(400).json({ status: 'fail', message: 'Invalid action' });

    const comment = await Comment.findById(commentId).populate('post');
    if (!comment)
      return res.status(404).json({ status: 'fail', message: 'Comment not found' });

    const authorId = comment.user;

    const wasUpvoted = comment.upvotes.includes(userId);
    const wasDownvoted = comment.downvotes.includes(userId);

    const oldVoteValue = wasUpvoted ? 1 : wasDownvoted ? -1 : 0;
    let newVoteValue = 0;

    // Remove any previous vote
    comment.upvotes.pull(userId);
    comment.downvotes.pull(userId);

    // Toggle logic
    if (action === 'up' && !wasUpvoted) {
      comment.upvotes.push(userId);
      newVoteValue = 1;
    } 
    else if (action === 'down' && !wasDownvoted) {
      comment.downvotes.push(userId);
      newVoteValue = -1;
    }
    // else → same vote clicked again → unvote

    await comment.save();

    const karmaChange = newVoteValue - oldVoteValue;

    if (karmaChange !== 0) {
      await User.findByIdAndUpdate(authorId, {
        $inc: { commentKarma: karmaChange }
      });
    }

    const communityId = comment.post.community;

    await checkAchievement(authorId, {
      type: 'karma',
      communityId
    });

    res.status(200).json({
      status: 'success',
      data: {
        upvotesCount: comment.upvotes.length,
        downvotesCount: comment.downvotes.length,
        userVote: newVoteValue
      }
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


module.exports = {
  addComment,
  updateComment,
  deleteComment,
  voteComment
};
