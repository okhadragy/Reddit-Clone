const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Community must have a name'],
    unique: true,
    trim: true,
  },
  coverImage: {
    type: String,
    default: 'community.png',
    validate: imageFileValidator("communities")
  },
  description: {
    type: String,
    trim: true,
  },
  allowedPostTypes: {
    type: [String],
    enum: ['text', 'image', 'media', 'link'],
    default: ['text', 'media', 'link'],
  },
  flairs: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Community must have a creator'],
  },
  joined: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
}, { timestamps: true });

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;
