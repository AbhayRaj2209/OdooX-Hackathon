import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = ({ companyName, onBackToUser, adminUser }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Refresh the page to reset the application state
    window.location.reload();
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <header className="admin-header">
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
            <small>Admin Panel</small>
          </div>
        </div>

        {/* Company Info */}
        <div className="company-info">
          <div className="company-badge">
            <span className="company-icon">🏢</span>
            <span className="company-name">{companyName}</span>
          </div>
        </div>

        {/* User Actions */}
        <div className="header-actions">
          {/* Back to User Button */}
          <button className="back-to-user-btn" onClick={onBackToUser}>
            <svg viewBox="0 0 24 24" className="back-icon">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to User
          </button>
          
          {/* Notifications */}
          <button className="notification-btn">
            <svg viewBox="0 0 24 24" className="notification-icon">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            <span className="notification-badge">3</span>
          </button>

          {/* Profile Dropdown */}
          <div className="profile-section">
            <button className="profile-btn" onClick={handleProfileClick}>
              <div className="profile-avatar">
                <span>A</span>
              </div>
              <div className="profile-info">
                <span className="profile-name">{adminUser?.email || 'Admin User'}</span>
                <span className="profile-role">Administrator</span>
              </div>
              <svg viewBox="0 0 24 24" className="dropdown-arrow">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item">
                  <svg viewBox="0 0 24 24" className="dropdown-icon">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span>Profile Settings</span>
                </div>
                <div className="dropdown-item">
                  <svg viewBox="0 0 24 24" className="dropdown-icon">
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                  </svg>
                  <span>System Settings</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" className="dropdown-icon">
                    <path d="M16 13v-2H7V8l-5 4 5 4v-3z"/>
                    <path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"/>
                  </svg>
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
