const express = require('express');
const router = express.Router();
const { getPosts, createPost, addComment, toggleLike } = require('../controllers/socialController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.post('/', authenticate, createPost);
router.post('/:id/comments', authenticate, addComment);
router.post('/:id/like', authenticate, toggleLike);

module.exports = router;
