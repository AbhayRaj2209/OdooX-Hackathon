import React, { useState } from 'react';
import './ApprovalRules.css';

const ApprovalRules = () => {
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'Standard Approval Flow',
      description: 'Manager → Finance → Director',
      type: 'Sequential',
      amountThreshold: 0,
      status: 'Active',
      approvers: ['Manager', 'Finance', 'Director']
    },
    {
      id: 2,
      name: 'High Value Expenses',
      description: 'CFO approval required for expenses >$1000',
      type: 'Conditional',
      amountThreshold: 1000,
      status: 'Active',
      approvers: ['CFO']
    },
    {
      id: 3,
      name: 'Percentage Rule',
      description: '60% of approvers must approve',
      type: 'Percentage',
      percentage: 60,
      status: 'Active',
      approvers: ['Manager', 'Finance', 'Director', 'CFO']
    }
  ]);

  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    type: 'Sequential',
    amountThreshold: 0,
    percentage: 50,
    approvers: []
  });

  const handleCreateRule = () => {
    if (newRule.name && newRule.description) {
      const rule = {
        id: rules.length + 1,
        ...newRule,
        status: 'Active'
      };
      setRules([...rules, rule]);
      setNewRule({
        name: '',
        description: '',
        type: 'Sequential',
        amountThreshold: 0,
        percentage: 50,
        approvers: []
      });
      setShowCreateRuleModal(false);
    }
  };

  const toggleRuleStatus = (ruleId) => {
    setRules(rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, status: rule.status === 'Active' ? 'Inactive' : 'Active' }
        : rule
    ));
  };

  const deleteRule = (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules(rules.filter(rule => rule.id !== ruleId));
    }
  };

  return (
    <div className="approval-rules">
      <div className="section-header">
        <div className="header-content">
          <h2>Approval Rules</h2>
          <p>Configure expense approval workflows and conditions</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowCreateRuleModal(true)}
        >
          <span className="btn-icon">+</span>
          Create Rule
        </button>
      </div>

      {/* Rules Grid */}
      <div className="rules-grid">
        {rules.map(rule => (
          <div key={rule.id} className="rule-card">
            <div className="rule-header">
              <h3>{rule.name}</h3>
              <div className="rule-actions">
                <button 
                  className={`toggle-btn ${rule.status.toLowerCase()}`}
                  onClick={() => toggleRuleStatus(rule.id)}
                >
                  {rule.status}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => deleteRule(rule.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <p className="rule-description">{rule.description}</p>
            
            <div className="rule-details">
              <div className="detail-item">
                <span className="detail-label">Type:</span>
                <span className={`type-badge ${rule.type.toLowerCase()}`}>
                  {rule.type}
                </span>
              </div>
              
              {rule.type === 'Conditional' && (
                <div className="detail-item">
                  <span className="detail-label">Threshold:</span>
                  <span>${rule.amountThreshold}</span>
                </div>
              )}
              
              {rule.type === 'Percentage' && (
                <div className="detail-item">
                  <span className="detail-label">Percentage:</span>
                  <span>{rule.percentage}%</span>
                </div>
              )}
              
              <div className="detail-item">
                <span className="detail-label">Approvers:</span>
                <div className="approvers-list">
                  {rule.approvers.map((approver, index) => (
                    <span key={index} className="approver-tag">
                      {approver}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Rule Modal */}
      {showCreateRuleModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create Approval Rule</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateRuleModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Rule Name *</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  placeholder="Enter rule name"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                  placeholder="Describe the rule"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Rule Type *</label>
                <select
                  value={newRule.type}
                  onChange={(e) => setNewRule({...newRule, type: e.target.value})}
                >
                  <option value="Sequential">Sequential (Step by step)</option>
                  <option value="Conditional">Conditional (Based on amount)</option>
                  <option value="Percentage">Percentage (X% must approve)</option>
                  <option value="Hybrid">Hybrid (Combination)</option>
                </select>
              </div>

              {newRule.type === 'Conditional' && (
                <div className="form-group">
                  <label>Amount Threshold ($)</label>
                  <input
                    type="number"
                    value={newRule.amountThreshold}
                    onChange={(e) => setNewRule({...newRule, amountThreshold: parseFloat(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              )}

              {newRule.type === 'Percentage' && (
                <div className="form-group">
                  <label>Approval Percentage (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newRule.percentage}
                    onChange={(e) => setNewRule({...newRule, percentage: parseInt(e.target.value)})}
                    placeholder="50"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Approvers</label>
                <div className="approvers-selection">
                  {['Manager', 'Finance', 'Director', 'CFO', 'HR'].map(approver => (
                    <label key={approver} className="approver-checkbox">
                      <input
                        type="checkbox"
                        checked={newRule.approvers.includes(approver)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRule({...newRule, approvers: [...newRule.approvers, approver]});
                          } else {
                            setNewRule({...newRule, approvers: newRule.approvers.filter(a => a !== approver)});
                          }
                        }}
                      />
                      <span>{approver}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowCreateRuleModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleCreateRule}
              >
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalRules;
