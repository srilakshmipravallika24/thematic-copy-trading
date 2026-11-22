const { getDbStatus } = require('../config/db');
const Portfolio = require('../models/Portfolio');
const CopyTrade = require('../models/CopyTrade');
const RegulatoryLog = require('../models/RegulatoryLog');
const { calculateMirrorAllocation } = require('../utils/mirrorCalculator');
const { mockPortfolios, mockCopyTrades, mockRegulatoryLogs } = require('../utils/mockStore');

const previewAllocation = async (req, res, next) => {
  try {
    const { portfolioId, capitalAmount, cashBufferPercent = 5 } = req.body;

    let targetPortfolio;
    if (getDbStatus()) {
      targetPortfolio = await Portfolio.findById(portfolioId);
    } else {
      targetPortfolio = mockPortfolios.find((p) => p._id === portfolioId || p.slug === portfolioId);
    }

    if (!targetPortfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found.' });
    }

    const calculation = calculateMirrorAllocation(targetPortfolio, capitalAmount, cashBufferPercent);

    return res.json({
      success: true,
      calculation,
      disclaimer:
        'Simulated allocation preview. Final execution prices may vary based on market liquidity and fractional share order routing.',
    });
  } catch (err) {
    next(err);
  }
};

const subscribeCopy = async (req, res, next) => {
  try {
    const { portfolioId, allocatedCapital, cashBufferPercent = 5, stopLossPercent = 15, autoRebalance = true, suitabilityAcknowledged } = req.body;

    let targetPortfolio;
    if (getDbStatus()) {
      targetPortfolio = await Portfolio.findById(portfolioId);
    } else {
      targetPortfolio = mockPortfolios.find((p) => p._id === portfolioId || p.slug === portfolioId);
    }

    if (!targetPortfolio) {
      return res.status(404).json({ success: false, message: 'Thematic portfolio not found.' });
    }

    // 1. Calculate orders
    const calculation = calculateMirrorAllocation(targetPortfolio, allocatedCapital, cashBufferPercent);

    // 2. Prepare trade record
    const copyTradeData = {
      retailUser: req.user._id,
      portfolio: targetPortfolio._id,
      advisor: targetPortfolio.advisor._id || targetPortfolio.advisor,
      allocatedCapital: Number(allocatedCapital),
      cashBufferPercent,
      stopLossPercent,
      autoRebalance,
      mirroredPositions: calculation.positions,
      status: 'ACTIVE',
      unrealizedPnL: 0,
      suitabilityAcknowledged,
    };

    if (getDbStatus()) {
      const copyTrade = await CopyTrade.create(copyTradeData);

      // Increment portfolio copiers and capital
      await Portfolio.findByIdAndUpdate(targetPortfolio._id, {
        $inc: { copiersCount: 1, totalMirroredCapital: Number(allocatedCapital) },
      });

      // Regulatory compliance audit entry
      await RegulatoryLog.create({
        userId: req.user._id,
        action: 'COPY_ALLOCATION_AUTHORIZED',
        metadata: {
          copyTradeId: copyTrade._id,
          portfolioTitle: targetPortfolio.title,
          amount: allocatedCapital,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Successfully mirrored thematic portfolio. Allocation orders logged.',
        copyTrade,
      });
    } else {
      // In-memory fallback
      const created = {
        _id: `copy_${Date.now()}`,
        ...copyTradeData,
        portfolio: targetPortfolio,
        createdAt: new Date(),
      };
      mockCopyTrades.unshift(created);

      targetPortfolio.copiersCount += 1;
      targetPortfolio.totalMirroredCapital += Number(allocatedCapital);

      mockRegulatoryLogs.push({
        _id: `reg_${Date.now()}`,
        userId: req.user._id,
        action: 'COPY_ALLOCATION_AUTHORIZED',
        metadata: {
          copyTradeId: created._id,
          portfolioTitle: targetPortfolio.title,
          amount: allocatedCapital,
        },
        timestamp: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: 'Successfully mirrored thematic portfolio (Active Simulation).',
        copyTrade: created,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getMyCopyTrades = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      const trades = await CopyTrade.find({ retailUser: req.user._id })
        .populate('portfolio')
        .populate('advisor', 'name email avatar riaProfile');
      return res.json({ success: true, count: trades.length, trades });
    } else {
      const list = mockCopyTrades.filter(
        (t) => (t.retailUser._id || t.retailUser) === req.user._id || req.user.role === 'retail'
      );
      return res.json({ success: true, count: list.length, trades: list });
    }
  } catch (err) {
    next(err);
  }
};

const updateCopyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'ACTIVE', 'PAUSED', 'TERMINATED'

    if (!['ACTIVE', 'PAUSED', 'TERMINATED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    if (getDbStatus()) {
      const updated = await CopyTrade.findOneAndUpdate(
        { _id: id, retailUser: req.user._id },
        { status },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Copy trade relationship not found.' });
      }
      return res.json({ success: true, message: `Mirror status updated to ${status}.`, copyTrade: updated });
    } else {
      const trade = mockCopyTrades.find((t) => t._id === id);
      if (trade) {
        trade.status = status;
        return res.json({ success: true, message: `Mirror status updated to ${status}.`, copyTrade: trade });
      }
      return res.status(404).json({ success: false, message: 'Copy trade relationship not found.' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  previewAllocation,
  subscribeCopy,
  getMyCopyTrades,
  updateCopyStatus,
};
