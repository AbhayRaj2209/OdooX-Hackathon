import React, { useState } from 'react';
import './CompanySettings.css';

const CompanySettings = ({ companyData, setCompanyData }) => {
  const [settings, setSettings] = useState({
    ...companyData,
    emailNotifications: true,
    autoApproval: false,
    receiptRequired: true,
    maxExpenseAmount: 5000,
    expenseCategories: ['Meals', 'Travel', 'Office Supplies', 'Transportation', 'Other'],
    workingHours: '9:00 AM - 6:00 PM',
    timezone: 'UTC-5'
  });

  const [newCategory, setNewCategory] = useState('');

  const handleSaveSettings = () => {
    setCompanyData(settings);
    alert('Settings saved successfully!');
  };

  const addCategory = () => {
    if (newCategory && !settings.expenseCategories.includes(newCategory)) {
      setSettings({
        ...settings,
        expenseCategories: [...settings.expenseCategories, newCategory]
      });
      setNewCategory('');
    }
  };

  const removeCategory = (category) => {
    setSettings({
      ...settings,
      expenseCategories: settings.expenseCategories.filter(c => c !== category)
    });
  };

  return (
    <div className="company-settings">
      <div className="section-header">
        <div className="header-content">
          <h2>Company Settings</h2>
          <p>Configure your company's expense management preferences</p>
        </div>
        <button className="btn-primary" onClick={handleSaveSettings}>
          Save Settings
        </button>
      </div>

      <div className="settings-grid">
        {/* Company Information */}
        <div className="settings-section">
          <h3>Company Information</h3>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({...settings, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Default Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({...settings, currency: e.target.value})}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
          <div className="form-group">
            <label>Country</label>
            <select
              value={settings.country}
              onChange={(e) => setSettings({...settings, country: e.target.value})}
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="India">India</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
            </select>
          </div>
          <div className="form-group">
            <label>Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
            >
              <option value="UTC-5">UTC-5 (EST)</option>
              <option value="UTC-8">UTC-8 (PST)</option>
              <option value="UTC+0">UTC+0 (GMT)</option>
              <option value="UTC+5:30">UTC+5:30 (IST)</option>
              <option value="UTC+1">UTC+1 (CET)</option>
            </select>
          </div>
        </div>

        {/* Expense Settings */}
        <div className="settings-section">
          <h3>Expense Settings</h3>
          <div className="form-group">
            <label>Maximum Expense Amount ({settings.currency})</label>
            <input
              type="number"
              value={settings.maxExpenseAmount}
              onChange={(e) => setSettings({...settings, maxExpenseAmount: parseFloat(e.target.value)})}
            />
          </div>
          <div className="form-group">
            <label>Working Hours</label>
            <input
              type="text"
              value={settings.workingHours}
              onChange={(e) => setSettings({...settings, workingHours: e.target.value})}
              placeholder="9:00 AM - 6:00 PM"
            />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.receiptRequired}
                onChange={(e) => setSettings({...settings, receiptRequired: e.target.checked})}
              />
              <span>Receipt Required for All Expenses</span>
            </label>
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.autoApproval}
                onChange={(e) => setSettings({...settings, autoApproval: e.target.checked})}
              />
              <span>Enable Auto-Approval for Small Amounts</span>
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section">
          <h3>Notification Settings</h3>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
              />
              <span>Email Notifications</span>
            </label>
          </div>
          <div className="form-group">
            <label>Notification Email</label>
            <input
              type="email"
              value="admin@company.com"
              disabled
              className="disabled-input"
            />
          </div>
        </div>

        {/* Expense Categories */}
        <div className="settings-section">
          <h3>Expense Categories</h3>
          <div className="categories-list">
            {settings.expenseCategories.map((category, index) => (
              <div key={index} className="category-item">
                <span>{category}</span>
                <button 
                  className="remove-category"
                  onClick={() => removeCategory(category)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="add-category">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add new category"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <button onClick={addCategory}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
