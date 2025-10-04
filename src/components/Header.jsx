import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ onAdminLogin, hasAdminAccess = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Refresh the page to reset the application state
    window.location.reload();
  };

  const handleAdminLoginSuccess = (adminUser) => {
    onAdminLogin(adminUser);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="odoo-logo">
            <svg viewBox="0 0 100 40" className="logo-svg">
              <rect x="10" y="10" width="15" height="20" rx="2" fill="#714B67"/>
              <rect x="30" y="5" width="15" height="30" rx="2" fill="#875A7B"/>
              <rect x="50" y="8" width="15" height="24" rx="2" fill="#714B67"/>
              <rect x="70" y="12" width="15" height="16" rx="2" fill="#875A7B"/>
            </svg>
            <span className="logo-text">Odoo</span>
          </div>
          <div className="project-name">
            <span>ExpenseFlow</span>
            <small>Smart Expense Management</small>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li><a href="#home" className="nav-link">Home</a></li>
            <li><a href="#features" className="nav-link">Features</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
        </nav>

        {/* User Actions */}
        <div className="header-actions">
          {hasAdminAccess && (
            <button 
              className="admin-login-btn"
              onClick={() => onAdminLogin({ id: 1, email: 'admin@expenseflow.com', name: 'Admin User', role: 'admin' })}
            >
              <svg viewBox="0 0 24 24" className="admin-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Admin Portal
            </button>
          )}
          <button className="profile-btn">
            <div className="profile-avatar">
              <span>U</span>
            </div>
            <span className="profile-name">User</span>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" className="logout-icon">
              <path d="M16 13v-2H7V8l-5 4 5 4v-3z"/>
              <path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"/>
            </svg>
            Logout
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

    </header>
  );
};

export default Header;
