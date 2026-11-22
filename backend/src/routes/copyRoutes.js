const express = require('express');
const router = express.Router();
const {
  previewAllocation,
  subscribeCopy,
  getMyCopyTrades,
  updateCopyStatus,
} = require('../controllers/copyController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateCopyTrade } = require('../middleware/validationMiddleware');

router.post('/preview', previewAllocation);
router.post('/subscribe', authenticate, validateCopyTrade, subscribeCopy);
router.get('/my-trades', authenticate, getMyCopyTrades);
router.patch('/:id/status', authenticate, updateCopyStatus);

module.exports = router;
