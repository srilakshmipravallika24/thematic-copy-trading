const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  targetWeight: { type: Number, required: true },
  allocatedDollars: { type: Number, required: true },
  estimatedShares: { type: Number, required: true },
  executionPrice: { type: Number, required: true },
});

const copyTradeSchema = new mongoose.Schema(
  {
    retailUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio',
      required: true,
    },
    advisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    allocatedCapital: {
      type: Number,
      required: true,
      min: [500, 'Minimum copy-trade capital is $500'],
    },
    cashBufferPercent: {
      type: Number,
      default: 5, // 5% kept in uninvested cash for slippage / fees
    },
    stopLossPercent: {
      type: Number,
      default: 15, // Exit trigger
    },
    autoRebalance: {
      type: Boolean,
      default: true,
    },
    mirroredPositions: [positionSchema],
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'TERMINATED'],
      default: 'ACTIVE',
    },
    unrealizedPnL: {
      type: Number,
      default: 0,
    },
    suitabilityAcknowledged: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CopyTrade', copyTradeSchema);
