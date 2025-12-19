const mongoose = require('mongoose');
const imageFileValidator = require('../utils/imageFileValidator');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Community must have a name'],
    unique: true,
    trim: true,
  },
  icon: {
     type: String, 
     default: 'icon.png',
      validate: imageFileValidator("communities")
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
    default: ['text', 'media', 'image','link'],
  },
  userFlairs: [{
    text: { type: String, required: true },
    backgroundColor: { type: String, default: '#grey' },
    textColor: { type: String, default: '#black' }
  }],
  postFlairs: [{
    type: String 
    
  }],
  tags: {
    type: [String],
    default: [],
  },
  topics: {
    type: [String],
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Community must have a creator'],
  },
  visibility: {
    type: String,
    enum: ['public', 'private','restricted'],
    default: 'user'
  },

  rules: [{
    title: { type: String, required: true },
    description: { type: String }
  }],
  disabledAchievements: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement' 
  }],
}, { timestamps: true });

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;
