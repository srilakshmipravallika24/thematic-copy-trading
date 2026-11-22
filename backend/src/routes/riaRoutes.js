const express = require('express');
const router = express.Router();
const { getTopAdvisors, getAdvisorById } = require('../controllers/riaController');

router.get('/', getTopAdvisors);
router.get('/:id', getAdvisorById);

module.exports = router;
