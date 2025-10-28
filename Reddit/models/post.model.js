const mongoose = require('mongoose');
const validator = require('validator');
const mediaFileValidator = require('../utils/mediaFileValidator');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },
    content: {
      type: String,
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ['image', 'media' , 'text', 'link'],
      default: 'text',
    },
    media: [{
      type: String,
      validate: mediaFileValidator('posts'),
    }],
    link: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validator.isURL(v);
        },
        message: 'Please provide a valid link',
      },
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
      required: [true, 'Post must belong to a community'],
    },
    flair: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'Post must have at least one tag',
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must have an author'],
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
