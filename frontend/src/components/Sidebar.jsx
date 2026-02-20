import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCircle,
  Settings,
  ShieldCheck,
  BookOpen,
  Network as NetworkIcon,
  LogOut,
  BrainCircuit,
  LogIn,
  UserPlus,
  FileQuestion,
  Globe
} from 'lucide-react';

const Sidebar = ({ theme, onLogout }) => {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo-orb">
          <BrainCircuit size={24} color="white" />
        </div>
        <span className="logo-text">ALME</span>
      </div>

      <nav className="nav-menu">
        <div className="nav-section">
          <p className="nav-label">Main Panels</p>
          <NavLink to="/student" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

        </div>

        <div className="nav-section">
          <p className="nav-label">Academic</p>
          <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <BookOpen size={20} />
            <span>My Courses</span>
          </NavLink>
          <NavLink to="/network" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <NetworkIcon size={20} />
            <span>Network</span>
          </NavLink>
          <NavLink to="/quizzes" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FileQuestion size={20} />
            <span>Quizzes</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <p className="nav-label">Account</p>
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <LogIn size={20} />
                <span>Login</span>
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <UserPlus size={20} />
                <span>Register</span>
              </NavLink>
            </>
          ) : (
            <div className="nav-item" onClick={onLogout} style={{ cursor: 'pointer', color: 'var(--accent)' }}>
              <LogOut size={20} />
              <span>Sign Out</span>
            </div>
          )}
        </div>
      </nav>

      <div className="sidebar-bottom-actions" style={{ marginTop: 'auto', paddingBottom: '1rem' }}>
        <NavLink to="/" className="nav-item back-home-btn">
            <Globe size={20} />
            <span>Back to Website</span>
        </NavLink>
      </div>

      {isAuthenticated && (
        <div className="sidebar-footer" style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <div className="user-card-mini" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(0,0,0,0.1)', borderRadius: '12px' }}>
            <div className="mini-avatar" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="mini-info" style={{ display: 'flex', flexDirection: 'column' }}>
              <p className="mini-name" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</p>
              <p className="mini-role" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
