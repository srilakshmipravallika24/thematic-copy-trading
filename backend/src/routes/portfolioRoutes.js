const express = require('express');
const router = express.Router();
const { getAllPortfolios, getPortfolioById, createPortfolio } = require('../controllers/portfolioController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const { validatePortfolioCreation } = require('../middleware/validationMiddleware');

router.get('/', getAllPortfolios);
router.get('/:id', getPortfolioById);
router.post('/', authenticate, requireRole('ria', 'admin'), validatePortfolioCreation, createPortfolio);

module.exports = router;
