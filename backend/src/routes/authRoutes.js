const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateRegistration } = require('../middleware/validationMiddleware');

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

module.exports = router;
