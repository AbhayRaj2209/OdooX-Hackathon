import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import './UserDashboard.css';

const UserDashboard = ({ onAdminLogin, hasAdminAccess = false }) => {
  const [activeTab, setActiveTab] = useState('submit');

  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    currency: 'USD',
    category: '',
    date: '',
    description: '',
    receipt: null
  });

  const [expenses] = useState([
    {
      id: 1,
      amount: 125.50,
      currency: 'USD',
      category: 'Meals',
      date: '2024-10-01',
      status: 'Pending',
      description: 'Client lunch meeting'
    },
    {
      id: 2,
      amount: 89.00,
      currency: 'USD',
      category: 'Travel',
      date: '2024-09-30',
      status: 'Approved',
      description: 'Taxi fare to client office'
    },
    {
      id: 3,
      amount: 250.00,
      currency: 'USD',
      category: 'Office Supplies',
      date: '2024-09-29',
      status: 'Rejected',
      description: 'Office equipment purchase'
    }
  ]);

  const handleSubmitExpense = (e) => {
    e.preventDefault();
    if (expenseForm.amount && expenseForm.category && expenseForm.description) {
      alert('Expense submitted successfully!');
      setExpenseForm({
        amount: '',
        currency: 'USD',
        category: '',
        date: '',
        description: '',
        receipt: null
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExpenseForm({...expenseForm, receipt: file});
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'approved';
      case 'Rejected': return 'rejected';
      case 'Pending': return 'pending';
      default: return 'pending';
    }
  };

  return (
    <div className="user-dashboard">
      <Header onAdminLogin={onAdminLogin} hasAdminAccess={hasAdminAccess} />
      
      <main className="main-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>My Expense Dashboard</h1>
            <p>Submit and track your expense claims</p>
          </div>

          <div className="dashboard-tabs">
            <button 
              className={`tab ${activeTab === 'submit' ? 'active' : ''}`}
              onClick={() => setActiveTab('submit')}
            >
              📝 Submit Expense
            </button>
            <button 
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              📋 My History
            </button>
            <button 
              className={`tab ${activeTab === 'ocr' ? 'active' : ''}`}
              onClick={() => setActiveTab('ocr')}
            >
              📷 OCR Upload
            </button>
          </div>

          <div className="dashboard-content">
            {activeTab === 'submit' && (
              <div className="expense-form-section">
                <div className="form-card">
                  <h3>Submit New Expense</h3>
                  <form onSubmit={handleSubmitExpense}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Amount *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={expenseForm.amount}
                          onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Currency</label>
                        <select
                          value={expenseForm.currency}
                          onChange={(e) => setExpenseForm({...expenseForm, currency: e.target.value})}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="INR">INR</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Category *</label>
                        <select
                          value={expenseForm.category}
                          onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="Meals">Meals</option>
                          <option value="Travel">Travel</option>
                          <option value="Office Supplies">Office Supplies</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Date *</label>
                        <input
                          type="date"
                          value={expenseForm.date}
                          onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        value={expenseForm.description}
                        onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                        placeholder="Describe your expense..."
                        rows="3"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Receipt</label>
                      <div className="file-upload">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          id="receipt-upload"
                        />
                        <label htmlFor="receipt-upload" className="file-upload-label">
                          📎 Upload Receipt
                        </label>
                        {expenseForm.receipt && (
                          <span className="file-name">{expenseForm.receipt.name}</span>
                        )}
                      </div>
                    </div>

                    <button type="submit" className="submit-btn">
                      Submit Expense
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="expense-history-section">
                <div className="history-card">
                  <h3>My Expense History</h3>
                  <div className="expenses-table">
                    <div className="table-header">
                      <div>Amount</div>
                      <div>Category</div>
                      <div>Date</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>
                    {expenses.map(expense => (
                      <div key={expense.id} className="table-row">
                        <div className="amount">
                          {expense.currency} {expense.amount.toFixed(2)}
                        </div>
                        <div className="category">{expense.category}</div>
                        <div className="date">{expense.date}</div>
                        <div className="status">
                          <span className={`status-badge ${getStatusColor(expense.status)}`}>
                            {expense.status}
                          </span>
                        </div>
                        <div className="actions">
                          <button className="view-btn">View</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ocr' && (
              <div className="ocr-upload-section">
                <div className="ocr-card">
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
                      <div className="data-item">
                        <span className="label">Amount:</span>
                        <span className="value">$125.50</span>
                      </div>
                      <div className="data-item">
                        <span className="label">Date:</span>
                        <span className="value">October 1, 2024</span>
                      </div>
                      <div className="data-item">
                        <span className="label">Merchant:</span>
                        <span className="value">Restaurant ABC</span>
                      </div>
                      <div className="data-item">
                        <span className="label">Category:</span>
                        <span className="value">Meals</span>
                      </div>
                    </div>
                    <button className="confirm-btn">Confirm & Submit</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
