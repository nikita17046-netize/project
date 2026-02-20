import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu, X, BrainCircuit, ChevronDown, Rocket, Globe, Book, Users,
  Zap, Shield, Layout, LogOut, User as UserIcon
} from "lucide-react";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const loggedIn = isAuthenticated || !!localStorage.getItem("token");

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <div className="logo-orb-sm">
            <BrainCircuit size={20} color="white" />
          </div>
          <span className="logo-text-sm">ALME</span>
        </NavLink>

        {/* Mobile Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        {/* Navigation Menu */}
        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
            {/* Standard Link */}
            <li className="navbar-item">
                <NavLink to="/" className="nav-links">Home</NavLink>
            </li>

            {/* Mega Menu: Solutions */}
            <li className="navbar-item">
                <span className="nav-links">
                    Solutions <ChevronDown size={14} />
                </span>
                <div className="mega-menu" style={{ width: '900px', gridTemplateColumns: '1fr 1fr 1.2fr' }}>
                    <div className="menu-column">
                        <h4>For Organizations</h4>
                        <NavLink to="/solutions/enterprise" className="menu-link-item">
                            <div className="menu-icon-box"><Globe size={18}/></div>
                            <div className="menu-text">
                                <h5>Enterprise Ecosystem</h5>
                                <p>Holistic learning infrastructure for global teams.</p>
                            </div>
                        </NavLink>
                        <NavLink to="/solutions/startups" className="menu-link-item">
                            <div className="menu-icon-box"><Rocket size={18}/></div>
                            <div className="menu-text">
                                <h5>Startup Accelerator</h5>
                                <p>Rapid skill acquisition for extensive growth.</p>
                            </div>
                        </NavLink>
                    </div>
                    <div className="menu-column">
                        <h4>For Individuals</h4>
                        <NavLink to="/solutions/students" className="menu-link-item">
                            <div className="menu-icon-box"><Zap size={18}/></div>
                            <div className="menu-text">
                                <h5>High-Performance Learning</h5>
                                <p>Master complex domains with AI assistance.</p>
                            </div>
                        </NavLink>
                         <NavLink to="/solutions/mentors" className="menu-link-item">
                            <div className="menu-icon-box"><Users size={18}/></div>
                            <div className="menu-text">
                                <h5>Mentor Network</h5>
                                <p>Monetize your expertise globally.</p>
                            </div>
                        </NavLink>
                    </div>
                    <div className="menu-column">
                        <div className="featured-card">
                            <h4>Featured</h4>
                            <h3>The Future of<br/>Autonomous Learning</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Discover how our AI core adapts to your unique cognitive path.</p>
                            <span className="btn-sm-arrow">Read the Whitepaper <Rocket size={14}/></span>
                        </div>
                    </div>
                </div>
            </li>

            {/* Mega Menu: Resources */}
            <li className="navbar-item">
                <span className="nav-links">
                    Resources <ChevronDown size={14} />
                </span>
                 <div className="mega-menu" style={{ width: '300px', gridTemplateColumns: '1fr' }}>
                    <div className="menu-column">
                        <h4>Learn</h4>
                        <NavLink to="/resources/blog" className="menu-link-item">
                            <div className="menu-icon-box"><Book size={18}/></div>
                            <div className="menu-text">
                                <h5>Blog</h5>
                                <p>Latest updates and guides.</p>
                            </div>
                        </NavLink>
                        <NavLink to="/resources/community" className="menu-link-item">
                             <div className="menu-icon-box"><Users size={18}/></div>
                            <div className="menu-text">
                                <h5>Community</h5>
                                <p>Join the discussion.</p>
                            </div>
                        </NavLink>
                    </div>
                </div>
            </li>
            
             <li className="navbar-item">
                <NavLink to="/all-courses" className="nav-links">Explore</NavLink>
            </li>

            <li className="navbar-item">
                <NavLink to="/network" className="nav-links">Network</NavLink>
            </li>

            {/* Auth Buttons */}
            <li className="navbar-item">
                {loggedIn ? (
                    <div className="profile-menu">
                        <div className="mini-avatar-sm">
                             {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="dropdown-menu">
                            <NavLink to="/student" className="dropdown-item">
                                <Layout size={16} /> Dashboard
                            </NavLink>

                            <div className="dropdown-item" onClick={onLogout}>
                                <LogOut size={16} /> Logout
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <NavLink to="/login" className="btn-auth-signin">Sign In</NavLink>
                        <NavLink to="/register" className="btn-auth-signup">Sign Up</NavLink>
                    </div>
                )}
            </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
