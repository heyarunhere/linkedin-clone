import React, { useEffect, useState } from 'react';
import api from '../api';
import PostCard from './PostCard';

export default function PostFeed({ refresh }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/posts');
      const sorted = [...data].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sorted);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to load posts';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setLoading(true); fetchPosts(); }, []);
  useEffect(() => { setLoading(true); fetchPosts(); }, [refresh]);

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-feed">
      <h3 className="section-title">Recent Posts</h3>
      {posts.length === 0
        ? <p className="no-posts">No posts yet. Be the first to post!</p>
        : posts.map((p) => <PostCard key={p._id} post={p} onUpdate={fetchPosts} />)}
    </div>
  );
}
