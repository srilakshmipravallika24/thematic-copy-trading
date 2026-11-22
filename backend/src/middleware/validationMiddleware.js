/**
 * Request Input Validation Middleware for Regulated Investment Compliance
 */

const validateRegistration = (req, res, next) => {
  const { name, email, password, role, riaProfile } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Valid full name (minimum 2 characters) is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email address is required.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  if (role === 'ria') {
    if (!riaProfile || !riaProfile.crdNumber) {
      return res.status(400).json({
        success: false,
        message: 'Registered Investment Advisors must provide a valid Central Registration Depository (CRD) number for regulatory verification.',
      });
    }
  }

  next();
};

const validatePortfolioCreation = (req, res, next) => {
  const { title, theme, allocations } = req.body;

  if (!title || !theme) {
    return res.status(400).json({ success: false, message: 'Portfolio title and thematic category are required.' });
  }

  if (!Array.isArray(allocations) || allocations.length === 0) {
    return res.status(400).json({ success: false, message: 'Portfolio must contain an array of asset allocations.' });
  }

  const totalWeight = allocations.reduce((sum, item) => sum + (Number(item.targetWeight) || 0), 0);
  if (Math.abs(totalWeight - 100) > 0.01) {
    return res.status(400).json({
      success: false,
      message: `Total asset allocations must sum to exactly 100%. Current sum: ${totalWeight}%.`,
    });
  }

  next();
};

const validateCopyTrade = (req, res, next) => {
  const { portfolioId, allocatedCapital, suitabilityAcknowledged } = req.body;

  if (!portfolioId) {
    return res.status(400).json({ success: false, message: 'Portfolio ID is required to copy.' });
  }

  const capital = Number(allocatedCapital);
  if (!capital || capital < 500) {
    return res.status(400).json({
      success: false,
      message: 'Minimum capital required to mirror an RIA thematic basket is $500.00.',
    });
  }

  if (!suitabilityAcknowledged) {
    return res.status(400).json({
      success: false,
      message: 'FINRA / SEC compliance requires explicit suitability risk acknowledgment before mirroring trade allocations.',
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validatePortfolioCreation,
  validateCopyTrade,
};
