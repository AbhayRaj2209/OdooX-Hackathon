import React, { useState } from 'react';
import AdminHeader from './AdminHeader';
import UserManagement from './UserManagement';
import ApprovalRules from './ApprovalRules';
import CompanySettings from './CompanySettings';
import ExpenseOverview from './ExpenseOverview';
import config from '../config/env';
import './AdminDashboard.css';

const AdminDashboard = ({ onBackToUser, adminUser }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [companyData, setCompanyData] = useState({
    name: config.companyName,
    currency: 'USD',
    country: 'United States',
    timezone: 'UTC-5',
    totalEmployees: 24,
    pendingApprovals: 156,
    totalExpenses: 12450,
    approvalRate: 89
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'rules', label: 'Approval Rules', icon: '⚙️' },
    { id: 'settings', label: 'Company Settings', icon: '🏢' },
    { id: 'expenses', label: 'All Expenses', icon: '💰' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ExpenseOverview companyData={companyData} />;
      case 'users':
        return <UserManagement />;
      case 'rules':
        return <ApprovalRules />;
      case 'settings':
        return <CompanySettings companyData={companyData} setCompanyData={setCompanyData} />;
      case 'expenses':
        return <ExpenseOverview companyData={companyData} showAllExpenses={true} />;
      default:
        return <ExpenseOverview companyData={companyData} />;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader companyName={companyData.name} onBackToUser={onBackToUser} adminUser={adminUser} />
      
      <div className="admin-container">
        <div className="admin-sidebar">
          <div className="sidebar-header">
            <h3>Admin Panel</h3>
            <p>Manage your expense system</p>
          </div>
          
          <nav className="sidebar-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="admin-main">
          <div className="admin-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
