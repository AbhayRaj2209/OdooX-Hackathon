import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [user, setUser] = useState(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    // Check if we have navigation state from login
    if (location.state) {
      if (location.state.isAdmin) {
        setIsAdmin(true);
        setAdminUser(location.state.adminUser);
      } else {
        setIsAdmin(false);
        setUser(location.state.user);
        setHasAdminAccess(location.state.hasAdminAccess || false);
      }
    }
  }, [location.state]);

  const handleAdminLogin = (user) => {
    setAdminUser(user);
    setIsAdmin(true);
  };

  const handleBackToUser = () => {
    setIsAdmin(false);
    setAdminUser(null);
    setUser(null);
    // Navigate back to login page
    navigate('/login');
  };

  if (isAdmin) {
    return (
      <div className="dashboard">
        <AdminDashboard onBackToUser={handleBackToUser} adminUser={adminUser} />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <UserDashboard onAdminLogin={handleAdminLogin} hasAdminAccess={hasAdminAccess} />
    </div>
  );
};

export default Dashboard;
