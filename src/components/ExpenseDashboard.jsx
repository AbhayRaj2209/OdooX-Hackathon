import React, { useState } from 'react';
import './ExpenseDashboard.css';

const ExpenseDashboard = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderAdminDashboard = () => (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p>Manage your company's expense system</p>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={`tab ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          Approval Rules
        </button>
        <button 
          className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          All Expenses
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>24</h3>
                  <p>Total Employees</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>156</h3>
                  <p>Pending Approvals</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>$12,450</h3>
                  <p>Total Expenses</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>89%</h3>
                  <p>Approval Rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h3>User Management</h3>
              <button className="btn-primary">Add Employee</button>
            </div>
            <div className="users-table">
              <div className="table-header">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Manager</span>
                <span>Actions</span>
              </div>
              <div className="table-row">
                <span>John Doe</span>
                <span>john@company.com</span>
                <span>Employee</span>
                <span>Jane Smith</span>
                <span>
                  <button className="btn-small">Edit</button>
                  <button className="btn-small danger">Remove</button>
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="rules-section">
            <div className="section-header">
              <h3>Approval Rules</h3>
              <button className="btn-primary">Create Rule</button>
            </div>
            <div className="rules-grid">
              <div className="rule-card">
                <h4>Standard Approval</h4>
                <p>Manager → Finance → Director</p>
                <span className="rule-status active">Active</span>
              </div>
              <div className="rule-card">
                <h4>High Value Expenses</h4>
                <p>CFO approval required for >$1000</p>
                <span className="rule-status active">Active</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="expenses-section">
            <div className="section-header">
              <h3>All Company Expenses</h3>
              <div className="filters">
                <select>
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
            <div className="expenses-table">
              <div className="table-header">
                <span>Employee</span>
                <span>Amount</span>
                <span>Category</span>
                <span>Date</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              <div className="table-row">
                <span>John Doe</span>
                <span>$125.50</span>
                <span>Meals</span>
                <span>2024-10-01</span>
                <span className="status pending">Pending</span>
                <span>
                  <button className="btn-small">View</button>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderManagerDashboard = () => (
    <div className="manager-dashboard">
      <div className="dashboard-header">
        <h2>Manager Dashboard</h2>
        <p>Review and approve team expenses</p>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Pending Approvals
        </button>
        <button 
          className={`tab ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          Team Expenses
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Approval History
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="pending-approvals">
            <div className="approval-card">
              <div className="approval-header">
                <div className="employee-info">
                  <div className="avatar">JD</div>
                  <div>
                    <h4>John Doe</h4>
                    <p>Software Engineer</p>
                  </div>
                </div>
                <div className="expense-amount">$125.50</div>
              </div>
              <div className="expense-details">
                <p><strong>Category:</strong> Meals</p>
                <p><strong>Date:</strong> October 1, 2024</p>
                <p><strong>Description:</strong> Client lunch meeting</p>
              </div>
              <div className="approval-actions">
                <button className="btn-success">Approve</button>
                <button className="btn-danger">Reject</button>
                <button className="btn-secondary">Request Info</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="team-expenses">
            <div className="expenses-table">
              <div className="table-header">
                <span>Employee</span>
                <span>Amount</span>
                <span>Category</span>
                <span>Date</span>
                <span>Status</span>
              </div>
              <div className="table-row">
                <span>John Doe</span>
                <span>$125.50</span>
                <span>Meals</span>
                <span>2024-10-01</span>
                <span className="status pending">Pending</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="approval-history">
            <div className="history-table">
              <div className="table-header">
                <span>Employee</span>
                <span>Amount</span>
                <span>Decision</span>
                <span>Date</span>
                <span>Comments</span>
              </div>
              <div className="table-row">
                <span>Jane Smith</span>
                <span>$89.00</span>
                <span className="status approved">Approved</span>
                <span>2024-09-30</span>
                <span>Valid business expense</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderEmployeeDashboard = () => (
    <div className="employee-dashboard">
      <div className="dashboard-header">
        <h2>My Expenses</h2>
        <p>Submit and track your expense claims</p>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Submit Expense
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          My History
        </button>
        <button 
          className={`tab ${activeTab === 'ocr' ? 'active' : ''}`}
          onClick={() => setActiveTab('ocr')}
        >
          OCR Upload
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="expense-form">
            <h3>Submit New Expense</h3>
            <form>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>INR</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select>
                  <option>Meals</option>
                  <option>Travel</option>
                  <option>Office Supplies</option>
                  <option>Transportation</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Describe your expense..."></textarea>
              </div>
              <div className="form-group">
                <label>Receipt</label>
                <input type="file" accept="image/*" />
              </div>
              <button type="submit" className="btn-primary">Submit Expense</button>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="expense-history">
            <div className="expenses-table">
              <div className="table-header">
                <span>Amount</span>
                <span>Category</span>
                <span>Date</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              <div className="table-row">
                <span>$125.50</span>
                <span>Meals</span>
                <span>2024-10-01</span>
                <span className="status pending">Pending</span>
                <span>
                  <button className="btn-small">View</button>
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ocr' && (
          <div className="ocr-upload">
            <h3>Upload Receipt for OCR Processing</h3>
            <div className="upload-area">
              <div className="upload-icon">📷</div>
              <p>Drag & drop your receipt image here</p>
              <p>or click to browse</p>
              <input type="file" accept="image/*" />
            </div>
            <div className="ocr-preview">
              <h4>Extracted Information:</h4>
              <div className="extracted-data">
                <p><strong>Amount:</strong> $125.50</p>
                <p><strong>Date:</strong> October 1, 2024</p>
                <p><strong>Merchant:</strong> Restaurant ABC</p>
                <p><strong>Category:</strong> Meals</p>
              </div>
              <button className="btn-primary">Confirm & Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="expense-dashboard">
      {userRole === 'admin' && renderAdminDashboard()}
      {userRole === 'manager' && renderManagerDashboard()}
      {userRole === 'employee' && renderEmployeeDashboard()}
    </div>
  );
};

export default ExpenseDashboard;
