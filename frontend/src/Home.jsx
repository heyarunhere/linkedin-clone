import React, { useState } from 'react';
import CreatePost from './components/CreatePost';
import PostFeed from './components/PostFeed';

export default function Home() {
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((n) => n + 1);

  return (
    <div className="home-wrap">
      <div className="home-grid">
        <div className="home-left">
          <CreatePost onCreated={bump} />
          <PostFeed refresh={refresh} />
        </div>

        <aside className="home-right">
          <div className="side-card">
            <h4>LinkedIn Clone</h4>
            <p style={{ color: '#64748b' }}>Welcome! Create a post and check the feed.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
