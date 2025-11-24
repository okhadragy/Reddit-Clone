const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const mongoose = require('mongoose');

// -------------------- Add Comment or Reply --------------------
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, parentComment } = req.body;
    const userId = req.userId;

    if (!text) return res.status(400).json({ status: 'fail', message: 'Comment text is required' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ status: 'fail', message: 'Post not found' });

    const comment = await Comment.create({
      post: postId,
      user: userId,
      text,
      parentComment: parentComment || null,
    });

    await User.findByIdAndUpdate(userId, {
    $push: { comments: comment._id }
    });

    post.comments.push(comment._id);
    await post.save();

    const populated = await Comment.findById(comment._id)
      .populate('user', 'name photo')
      .populate('parentComment', 'text user');

    res.status(201).json({ status: 'success', data: { comment: populated } });
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

    if (!['up', 'down'].includes(action)) return res.status(400).json({ status: 'fail', message: 'Invalid action' });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ status: 'fail', message: 'Comment not found' });

    const authorId = comment.user; 
    const wasUpvoted = comment.upvotes.includes(userId);
    const wasDownvoted = comment.downvotes.includes(userId);
    

    let oldVoteValue = (wasUpvoted ? 1 : 0) + (wasDownvoted ? -1 : 0);
    let newVoteValue = 0;


    comment.upvotes.pull(userId);
    comment.downvotes.pull(userId);

    if (action === 'up') {
        comment.upvotes.push(userId);
        newVoteValue = 1;
    } else if (action === 'down') {
        comment.downvotes.push(userId);
        newVoteValue = -1;
    } 


    const karmaChange = newVoteValue - oldVoteValue;

    await comment.save();
    

    if (karmaChange !== 0) {
        await User.findByIdAndUpdate(authorId, {
            $inc: { commentKarma: karmaChange }
        });
    }

    res.status(200).json({
      status: 'success',
      data: { upvotesCount: comment.upvotes.length, downvotesCount: comment.downvotes.length }
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
