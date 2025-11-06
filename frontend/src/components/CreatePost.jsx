import React, { useState } from 'react';
import api from '../api';

export default function CreatePost({ onCreated }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return setError('Write something or attach an image');
    setLoading(true); setError('');

    try {
      const form = new FormData();
      form.append('content', content);
      if (image) form.append('image', image);

      await api.post('/posts', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setContent('');
      setImage(null);
      onCreated?.(); 
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to create post';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-box">
      <h3>Create a Post</h3>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <textarea
          className="post-input"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
        />
        <div style={{display:'flex', gap:12, alignItems:'center', marginTop:10}}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
