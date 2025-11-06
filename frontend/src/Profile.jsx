import React, { useEffect, useState } from 'react';
import api from './api';

export default function Profile() {
  const [me, setMe] = useState(null);
  const [posts, setPosts] = useState([]);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await api.get('/users/me');
    setMe(data.user);
    setPosts(data.posts);
    setBio(data.user?.bio || '');
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData();
      form.append('bio', bio);
      if (avatar) form.append('avatar', avatar);
      const { data } = await api.put('/users/me', form, { headers: { 'Content-Type':'multipart/form-data' } });
      setMe(data);
      setAvatar(null);
    } finally {
      setSaving(false);
    }
  };

  if (!me) return <div className="loading">Loading...</div>;

  return (
    <div className="home-wrap">
      <div className="home-grid">
        <div className="home-left">
          <div className="card" style={{padding:16}}>
            <div style={{display:'flex', gap:16, alignItems:'center'}}>
              <img
                src={me.avatarUrl || 'https://via.placeholder.com/80?text=USER'}
                alt="avatar" width={80} height={80}
                style={{borderRadius:'50%', border:'1px solid #e6e9f0', objectFit:'cover'}}
              />
              <div>
                <h2 style={{margin:'0 0 4px'}}>{me.name}</h2>
                <div style={{color:'#6b7280'}}>{me.email}</div>
              </div>
            </div>

            <form onSubmit={save} style={{marginTop:16, display:'grid', gap:12}}>
              <label className="label">Bio</label>
              <textarea className="post-input" rows="3" value={bio} onChange={(e)=>setBio(e.target.value)} />
              <div>
                <label className="label" style={{display:'block'}}>Avatar</label>
                <input type="file" accept="image/*" onChange={(e)=>setAvatar(e.target.files?.[0] || null)} />
              </div>
              <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
            </form>
          </div>

          <div className="post-feed" style={{marginTop:16}}>
            <h3 className="section-title">Your Posts</h3>
            {posts.length === 0 ? <p className="no-posts">You haven’t posted yet.</p> : (
              posts.map(p => (
                <div key={p._id} className="post-card">
                  <div className="post-body">
                    {p.imageUrl && (
                      <div style={{marginTop:8, marginBottom:8}}>
                        <img src={p.imageUrl} alt="post" style={{maxWidth:'100%', borderRadius:12, border:'1px solid #e6e9f0'}}/>
                      </div>
                    )}
                    <p className="post-content">{p.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="home-right">
          <div className="side-card">
            <h4>Profile</h4>
            <p className="no-posts">Update your bio and avatar.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
