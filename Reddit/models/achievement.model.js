const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      default: 'default-badge.png',
      validate: {
        validator: (v) => !v || /\.(jpg|jpeg|png|svg|gif)$/.test(v),
        message: 'Invalid image format for achievement icon',
      },
    },
    type: {
      type: String,
      enum: ['post', 'comment', 'community', 'karma', 'custom'],
      default: 'custom',
    },
    condition: {
      type: Object,
      default: {}, // e.g., { posts: 10 } or { upvotes: 100 }
    },
  },
  { timestamps: true }
);

const Achievement = mongoose.model('Achievement', achievementSchema);
module.exports = Achievement;
