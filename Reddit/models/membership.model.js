const mongoose = require('mongoose');

const communityMemberSchema = new mongoose.Schema({
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // HERE is where you replaced the 'moderators' array from the other file
  role: {
    type: String,
    enum: ['member', 'moderator'], 
    default: 'member'
  },

  // HERE is where you link to the specific flair ID defined in the Community model
  selectedFlair: {
    type: mongoose.Schema.Types.ObjectId, 
    // Points to an _id inside the community.userFlairs array
  },
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'banned', 'muted'], 
    default: 'approved'
  }
}, { timestamps: true });

// Ensure a user can't join the same community twice
communityMemberSchema.index({ community: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('CommunityMember', communityMemberSchema);