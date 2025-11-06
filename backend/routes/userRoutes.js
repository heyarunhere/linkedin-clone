const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const ext = (file.originalname || '').split('.').pop();
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}.${ext}`);
  },
});
const upload = multer({ storage });

router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
  res.json({ user, posts });
});

router.put('/me', protect, upload.single('avatar'), async (req, res) => {
  const updates = { bio: req.body.bio ?? '' };
  if (req.file) updates.avatarUrl = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
  res.json(user);
});

module.exports = router;
