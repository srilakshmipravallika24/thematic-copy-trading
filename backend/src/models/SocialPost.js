const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const socialPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    themeTag: {
      type: String,
      default: 'General Market',
    },
    sentiment: {
      type: String,
      enum: ['Bullish', 'Bearish', 'Neutral'],
      default: 'Neutral',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [commentSchema],
    complianceNotice: {
      type: String,
      default:
        'Regulatory Compliance Disclaimer: Opinions expressed by registered advisors or community members do not constitute personalized financial advice. Past performance is no guarantee of future returns. Investing involves market risk of loss.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SocialPost', socialPostSchema);
