const { getDbStatus } = require('../config/db');
const SocialPost = require('../models/SocialPost');
const { mockSocialPosts, mockUsers } = require('../utils/mockStore');

const getPosts = async (req, res, next) => {
  try {
    const { themeTag } = req.query;

    if (getDbStatus()) {
      let filter = {};
      if (themeTag) filter.themeTag = themeTag;

      const posts = await SocialPost.find(filter)
        .populate('author', 'name email avatar role riaProfile')
        .populate('portfolio', 'title slug metrics theme')
        .populate('comments.user', 'name avatar role')
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: posts.length, posts });
    } else {
      let list = [...mockSocialPosts];
      if (themeTag) {
        list = list.filter((p) => p.themeTag.toLowerCase().includes(themeTag.toLowerCase()));
      }
      return res.json({ success: true, count: list.length, posts: list });
    }
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, content, themeTag, portfolioId, sentiment = 'Neutral' } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Post title and content are required.' });
    }

    const postData = {
      author: req.user._id,
      portfolio: portfolioId || null,
      title,
      content,
      themeTag: themeTag || 'General Thematic Discussion',
      sentiment,
      likes: [],
      comments: [],
      complianceNotice:
        'Regulatory Compliance Disclaimer: Commentary provided by RIA or community members is strictly educational and not individualized fiduciary advice.',
    };

    if (getDbStatus()) {
      const created = await SocialPost.create(postData);
      const populated = await SocialPost.findById(created._id)
        .populate('author', 'name email avatar role riaProfile')
        .populate('portfolio', 'title slug');
      return res.status(201).json({ success: true, post: populated });
    } else {
      const created = {
        _id: `post_${Date.now()}`,
        ...postData,
        author: req.user,
        createdAt: new Date(),
      };
      mockSocialPosts.unshift(created);
      return res.status(201).json({ success: true, post: created });
    }
  } catch (err) {
    next(err);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty.' });
    }

    if (getDbStatus()) {
      const post = await SocialPost.findById(id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Discussion post not found.' });
      }

      post.comments.push({
        user: req.user._id,
        text,
        createdAt: new Date(),
      });
      await post.save();

      const updated = await SocialPost.findById(id)
        .populate('author', 'name email avatar role riaProfile')
        .populate('comments.user', 'name avatar role');

      return res.json({ success: true, message: 'Comment posted.', post: updated });
    } else {
      const post = mockSocialPosts.find((p) => p._id === id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Discussion post not found.' });
      }

      const comment = {
        _id: `comm_${Date.now()}`,
        user: req.user,
        text,
        createdAt: new Date(),
      };
      post.comments.push(comment);

      return res.json({ success: true, message: 'Comment posted.', post });
    }
  } catch (err) {
    next(err);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    if (getDbStatus()) {
      const post = await SocialPost.findById(id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Discussion post not found.' });
      }

      const existsIndex = post.likes.findIndex((l) => l.toString() === userId);
      if (existsIndex > -1) {
        post.likes.splice(existsIndex, 1);
      } else {
        post.likes.push(req.user._id);
      }
      await post.save();

      return res.json({ success: true, likesCount: post.likes.length });
    } else {
      const post = mockSocialPosts.find((p) => p._id === id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Discussion post not found.' });
      }

      const index = post.likes.indexOf(userId);
      if (index > -1) {
        post.likes.splice(index, 1);
      } else {
        post.likes.push(userId);
      }
      return res.json({ success: true, likesCount: post.likes.length });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosts,
  createPost,
  addComment,
  toggleLike,
};
