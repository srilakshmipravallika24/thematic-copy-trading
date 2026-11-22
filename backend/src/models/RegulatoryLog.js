const mongoose = require('mongoose');

const regulatoryLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'SUITABILITY_TEST_PASSED',
        'DISCLOSURE_FORM_ADV_ACKNOWLEDGED',
        'COPY_ALLOCATION_AUTHORIZED',
        'COPY_TRADE_PAUSED',
        'PORTFOLIO_REBALANCE_SIGNAL_LOGGED',
      ],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    regulatoryReference: {
      type: String,
      default: 'SEC Rule 206(4)-1 & FINRA Rule 2210',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RegulatoryLog', regulatoryLogSchema);
