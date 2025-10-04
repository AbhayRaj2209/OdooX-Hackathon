import React, { useState } from 'react';
import './ExpenseOverview.css';

const ExpenseOverview = ({ companyData, showAllExpenses = false }) => {
  const [expenses] = useState([
    {
      id: 1,
      employee: 'John Doe',
      amount: 125.50,
      currency: 'USD',
      category: 'Meals',
      date: '2024-10-01',
      status: 'Pending',
      description: 'Client lunch meeting',
      approver: 'Jane Smith'
    },
    {
      id: 2,
      employee: 'Mike Johnson',
      amount: 89.00,
      currency: 'USD',
      category: 'Travel',
      date: '2024-09-30',
      status: 'Approved',
      description: 'Taxi fare to client office',
      approver: 'Jane Smith'
    },
    {
      id: 3,
      employee: 'Sarah Wilson',
      amount: 250.00,
      currency: 'USD',
      category: 'Office Supplies',
      date: '2024-09-29',
      status: 'Rejected',
      description: 'Office equipment purchase',
      approver: 'Jane Smith'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredExpenses = expenses.filter(expense => {
    const statusMatch = filterStatus === 'All' || expense.status === filterStatus;
    const categoryMatch = filterCategory === 'All' || expense.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'approved';
      case 'Rejected': return 'rejected';
      case 'Pending': return 'pending';
      default: return 'pending';
    }
  };

  if (showAllExpenses) {
    return (
      <div className="expense-overview">
        <div className="section-header">
          <div className="header-content">
            <h2>All Company Expenses</h2>
            <p>View and manage all expense claims</p>
          </div>
          <div className="filters">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Meals">Meals</option>
              <option value="Travel">Travel</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Transportation">Transportation</option>
            </select>
          </div>
        </div>

        <div className="expenses-table">
          <div className="table-header">
            <div className="col-employee">Employee</div>
            <div className="col-amount">Amount</div>
            <div className="col-category">Category</div>
            <div className="col-date">Date</div>
            <div className="col-status">Status</div>
            <div className="col-approver">Approver</div>
            <div className="col-actions">Actions</div>
          </div>

          {filteredExpenses.map(expense => (
            <div key={expense.id} className="table-row">
              <div className="col-employee">
                <div className="employee-info">
                  <div className="employee-avatar">
                    {expense.employee.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span>{expense.employee}</span>
                </div>
              </div>
              <div className="col-amount">
                {expense.currency} {expense.amount.toFixed(2)}
              </div>
              <div className="col-category">{expense.category}</div>
              <div className="col-date">{expense.date}</div>
              <div className="col-status">
                <span className={`status-badge ${getStatusColor(expense.status)}`}>
                  {expense.status}
                </span>
              </div>
              <div className="col-approver">{expense.approver}</div>
              <div className="col-actions">
                <button className="btn-small primary">View</button>
                {expense.status === 'Pending' && (
                  <button className="btn-small success">Approve</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="expense-overview">
      <div className="section-header">
        <div className="header-content">
          <h2>Dashboard Overview</h2>
          <p>Monitor your company's expense management system</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{companyData.totalEmployees}</h3>
            <p>Total Employees</p>
            <span className="stat-change">+2 this month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{companyData.pendingApprovals}</h3>
            <p>Pending Approvals</p>
            <span className="stat-change urgent">Requires attention</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>${companyData.totalExpenses.toLocaleString()}</h3>
            <p>Total Expenses</p>
            <span className="stat-change">+12% this month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{companyData.approvalRate}%</h3>
            <p>Approval Rate</p>
            <span className="stat-change positive">+3% improvement</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {expenses.slice(0, 5).map(expense => (
            <div key={expense.id} className="activity-item">
              <div className="activity-icon">
                {expense.status === 'Approved' ? '✅' : 
                 expense.status === 'Rejected' ? '❌' : '⏳'}
              </div>
              <div className="activity-content">
                <div className="activity-title">
                  {expense.employee} submitted a {expense.category.toLowerCase()} expense
                </div>
                <div className="activity-details">
                  {expense.currency} {expense.amount} • {expense.date} • {expense.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card">
            <div className="action-icon">👥</div>
            <div className="action-text">Add Employee</div>
          </button>
          <button className="action-card">
            <div className="action-icon">⚙️</div>
            <div className="action-text">Create Rule</div>
          </button>
          <button className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-text">View Reports</div>
          </button>
          <button className="action-card">
            <div className="action-icon">🏢</div>
            <div className="action-text">Company Settings</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseOverview;
