import React from 'react';
import { Sun, Moon, Bell, Search, User } from 'lucide-react';

const Header = ({ theme, toggleTheme }) => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <header className="header glass">
      <div className="search-bar" style={{ width: '450px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.6rem 1.25rem', borderRadius: '14px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input type="text" placeholder="Search for skills, courses, analytics..." style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', width: '100%', fontSize: '0.95rem' }} />
      </div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button onClick={toggleTheme} className="theme-toggle" style={{ cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
          {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
        </button>

        <div className="notification-bell" style={{ cursor: 'pointer', color: 'var(--text-muted)', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Bell size={22} />
          <span style={{
            position: 'absolute', top: '-5px', right: '-5px',
            background: 'var(--accent)', color: 'white',
            fontSize: '10px', padding: '2px 5px', borderRadius: '10px',
            fontWeight: 'bold', boxShadow: '0 0 10px rgba(244, 63, 94, 0.4)'
          }}>3</span>
        </div>

        {isAuthenticated && (
          <div className="user-profile-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)', height: '40px' }}>
            <div className="user-info" style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
              <div className="user-name" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{user?.name || 'Academic'}</div>
              <div className="user-role" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.role || 'Learner'}</div>
            </div>
            <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)' }}>
              {user?.name?.charAt(0) || <User size={20} />}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
