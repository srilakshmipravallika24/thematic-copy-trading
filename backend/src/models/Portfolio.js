const mongoose = require('mongoose');

const allocationItemSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  targetWeight: {
    type: Number, // percentage, e.g., 25 for 25%
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  sector: {
    type: String,
    default: 'General Equities',
  },
});

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    theme: {
      type: String,
      required: true,
      enum: [
        'Artificial Intelligence & Cloud',
        'Clean Tech & Renewable Energy',
        'Semiconductor & Hardware',
        'Healthcare & Biotech',
        'Defensive Value & Dividends',
        'Cybersecurity & Defense',
      ],
    },
    advisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    methodology: {
      type: String,
      default: 'Rules-based fundamental valuation combined with quarterly thematic momentum rebalancing.',
    },
    riskScore: {
      type: Number,
      min: 1,
      max: 10,
      default: 6,
    },
    allocations: [allocationItemSchema],
    metrics: {
      oneMonthReturn: { type: Number, default: 3.2 },
      oneYearReturn: { type: Number, default: 28.4 },
      allTimeReturn: { type: Number, default: 64.8 },
      sharpeRatio: { type: Number, default: 1.85 },
      maxDrawdown: { type: Number, default: -12.4 },
      volatility: { type: Number, default: 16.2 },
      benchmark: { type: String, default: 'S&P 500 (SPY)' },
      alphaVsBenchmark: { type: Number, default: 7.2 },
    },
    copiersCount: {
      type: Number,
      default: 0,
    },
    totalMirroredCapital: {
      type: Number,
      default: 0,
    },
    minInvestment: {
      type: Number,
      default: 1000,
    },
    lastRebalanced: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'UNDER_REVIEW', 'ARCHIVED'],
      default: 'ACTIVE',
    },
    regulatoryFormADVUrl: {
      type: String,
      default: 'https://adviserinfo.sec.gov/',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
