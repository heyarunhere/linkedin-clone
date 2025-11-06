import React from 'react';

export default function Navbar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-brand">LinkedIn Clone</div>
        <div className="nav-right">
          <a href="/profile" style={{textDecoration:'none'}}>Profile</a>
          {user?.name && <span>Hello, {user.name}!</span>}
          <button className="btn-out" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
}
