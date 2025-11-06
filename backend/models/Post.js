const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: { type: String, default: '' }, 
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: String,
    imageUrl: String,         
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userName: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
