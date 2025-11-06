import React, { useState } from 'react';
import api from '../api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const FILE_BASE = API_URL.replace(/\/api\/?$/, ''); // -> http://localhost:5000

export default function PostCard({ post, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const authorId =
    typeof post.author === 'string' ? post.author : post.author?._id;
  const isAuthor = !!currentUser?._id && currentUser._id === authorId;

  const formatDate = (d) => {
    const o = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(d).toLocaleDateString(undefined, o);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/posts/${post._id}`, { content: editContent });
      setIsEditing(false);
      onUpdate?.();
    } catch {
      alert('Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${post._id}`);
      onUpdate?.();
    } catch {
      alert('Failed to delete post');
    }
  };

  const handleLike = async () => {
    try {
      await api.post(`/posts/${post._id}/like`);
      onUpdate?.();
    } catch {
      alert('Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await api.post(`/posts/${post._id}/comment`, { text: commentText });
      setCommentText('');
      onUpdate?.();
    } catch {
      alert('Failed to add comment');
    }
  };

  const resolveSrc = (url) => (url?.startsWith('http') ? url : `${FILE_BASE}${url || ''}`);

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <div className="avatar">
            {(post.authorName || post.author?.name || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h4 className="author-name">{post.authorName || post.author?.name || 'User'}</h4>
            <p className="post-date">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {isAuthor && !isEditing && (
          <div className="post-actions">
            <button className="btn-ghost" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="btn-ghost" onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>

      <div className="post-body">
        {isEditing ? (
          <div className="edit-form">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="post-input"
              rows="3"
            />
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-primary" onClick={handleUpdate}>Save</button>
              <button className="btn-ghost" style={{ marginLeft: 8 }} onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {post.imageUrl && (
              <div style={{ marginTop: 8, marginBottom: 8 }}>
                <a href={resolveSrc(post.imageUrl)} target="_blank" rel="noreferrer">
                  <img
                    src={resolveSrc(post.imageUrl)}
                    alt="post"
                    style={{ maxWidth: '100%', borderRadius: 12, border: '1px solid #e6e9f0' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </a>
              </div>
            )}
            <p className="post-content">{post.content}</p>
          </>
        )}
      </div>

      <div className="post-footer">
        <div className="post-stats">
          <span>{post.likes?.length || 0} likes</span>
          <span>{post.comments?.length || 0} comments</span>
        </div>

        <div className="post-interactions">
          <button className="btn-chip" onClick={handleLike}>👍 Like</button>
          <button className="btn-chip" onClick={() => setShowComments(!showComments)}>💬 Comment</button>
        </div>

        {showComments && (
          <div className="comments-section">
            <form onSubmit={handleComment} className="comment-form">
              <input
                className="comment-input"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">Post</button>
            </form>

            <div className="comments-list">
              {post.comments?.map((c, i) => (
                <div key={i} className="comment">
                  <strong>{c.userName || 'User'}</strong> {c.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
