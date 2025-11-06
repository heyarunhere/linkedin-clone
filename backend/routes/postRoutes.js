const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = (file.originalname || '').split('.').pop();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`);
  },
});
const upload = multer({ storage });

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const hasContent = (req.body.content || '').trim().length > 0;
    const hasImage = !!req.file;

    if (!hasContent && !hasImage) {
      return res.status(400).json({ message: 'Write something or attach an image' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const imageUrl = hasImage ? `${baseUrl}/uploads/${req.file.filename}` : undefined;

    const post = await Post.create({
      content: hasContent ? req.body.content : '',
      author: req.user._id,
      authorName: req.user.name,
      imageUrl,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(400).json({ message: 'Failed to create post' });
  }
});

router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

router.put('/:id', protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (String(post.author) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not allowed' });
  }
  post.content = req.body.content ?? post.content;
  await post.save();
  res.json(post);
});

router.delete('/:id', protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (String(post.author) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not allowed' });
  }
  await post.deleteOne();
  res.json({ message: 'Post deleted' });
});

router.post('/:id/like', protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const i = post.likes.findIndex((u) => String(u) === String(req.user._id));
  if (i === -1) post.likes.push(req.user._id);
  else post.likes.splice(i, 1);

  await post.save();
  res.json({ likes: post.likes });
});

router.post('/:id/comment', protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  post.comments.push({
    user: req.user._id,
    userName: req.user.name,
    text: req.body.text || '',
    createdAt: new Date(),
  });

  await post.save();
  res.json({ comments: post.comments });
});

module.exports = router;
