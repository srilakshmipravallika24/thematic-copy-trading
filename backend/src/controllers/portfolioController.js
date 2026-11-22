const { getDbStatus } = require('../config/db');
const Portfolio = require('../models/Portfolio');
const { mockPortfolios } = require('../utils/mockStore');

const getAllPortfolios = async (req, res, next) => {
  try {
    const { theme, search, minReturn } = req.query;

    if (getDbStatus()) {
      let query = { status: 'ACTIVE' };
      if (theme) query.theme = theme;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      let portfolios = await Portfolio.find(query).populate('advisor', 'name email avatar riaProfile');
      return res.json({ success: true, count: portfolios.length, portfolios });
    } else {
      let list = [...mockPortfolios];
      if (theme) {
        list = list.filter((p) => p.theme.toLowerCase().includes(theme.toLowerCase()));
      }
      if (search) {
        const s = search.toLowerCase();
        list = list.filter((p) => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
      }
      return res.json({ success: true, count: list.length, portfolios: list });
    }
  } catch (err) {
    next(err);
  }
};

const getPortfolioById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const portfolio = await Portfolio.findById(id).populate('advisor', 'name email avatar riaProfile');
      if (!portfolio) {
        return res.status(404).json({ success: false, message: 'Thematic portfolio not found.' });
      }
      return res.json({ success: true, portfolio });
    } else {
      const portfolio = mockPortfolios.find((p) => p._id === id || p.slug === id);
      if (!portfolio) {
        return res.status(404).json({ success: false, message: 'Thematic portfolio not found.' });
      }
      return res.json({ success: true, portfolio });
    }
  } catch (err) {
    next(err);
  }
};

const createPortfolio = async (req, res, next) => {
  try {
    const { title, theme, description, methodology, riskScore, allocations, minInvestment } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newPortfolioData = {
      title,
      slug,
      theme,
      advisor: req.user._id,
      description,
      methodology: methodology || 'Systematic thematic equity weighting.',
      riskScore: Number(riskScore) || 5,
      allocations,
      minInvestment: Number(minInvestment) || 1000,
      metrics: {
        oneMonthReturn: 1.5,
        oneYearReturn: 18.0,
        allTimeReturn: 35.0,
        sharpeRatio: 1.7,
        maxDrawdown: -10.0,
        volatility: 14.5,
        benchmark: 'S&P 500 (SPY)',
        alphaVsBenchmark: 4.2,
      },
      copiersCount: 0,
      totalMirroredCapital: 0,
      status: 'ACTIVE',
    };

    if (getDbStatus()) {
      const portfolio = await Portfolio.create(newPortfolioData);
      return res.status(201).json({ success: true, message: 'Thematic portfolio created successfully.', portfolio });
    } else {
      const created = {
        _id: `port_${Date.now()}`,
        ...newPortfolioData,
        advisor: req.user,
        lastRebalanced: new Date(),
      };
      mockPortfolios.unshift(created);
      return res.status(201).json({ success: true, message: 'Thematic portfolio created successfully.', portfolio: created });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPortfolios,
  getPortfolioById,
  createPortfolio,
};
