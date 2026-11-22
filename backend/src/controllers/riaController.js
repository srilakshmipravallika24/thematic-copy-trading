const { getDbStatus } = require('../config/db');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const { mockUsers, mockPortfolios } = require('../utils/mockStore');

const getTopAdvisors = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      const advisors = await User.find({ role: 'ria' }).select('-password');
      return res.json({ success: true, count: advisors.length, advisors });
    } else {
      const advisors = mockUsers.filter((u) => u.role === 'ria');
      return res.json({ success: true, count: advisors.length, advisors });
    }
  } catch (err) {
    next(err);
  }
};

const getAdvisorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const advisor = await User.findOne({ _id: id, role: 'ria' }).select('-password');
      if (!advisor) {
        return res.status(404).json({ success: false, message: 'Advisor not found.' });
      }
      const portfolios = await Portfolio.find({ advisor: id, status: 'ACTIVE' });
      return res.json({ success: true, advisor, portfolios });
    } else {
      const advisor = mockUsers.find((u) => u._id === id && u.role === 'ria');
      if (!advisor) {
        return res.status(404).json({ success: false, message: 'Advisor not found.' });
      }
      const portfolios = mockPortfolios.filter(
        (p) => (p.advisor._id || p.advisor) === id || p.advisor.email === advisor.email
      );
      return res.json({ success: true, advisor, portfolios });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTopAdvisors,
  getAdvisorById,
};
