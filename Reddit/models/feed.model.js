const mongoose = require('mongoose');

const customFeedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Feed must have a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  communities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  }]
}, { timestamps: true });

// Prevent duplicate feed names for the same user
customFeedSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('CustomFeed', customFeedSchema);