import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: '👥',
      title: 'Role-Based Access',
      description: 'Admin, Manager, and Employee roles with specific permissions and workflows.',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: '📋',
      title: 'Smart Approval Flow',
      description: 'Multi-level approvals with conditional rules and percentage-based decisions.',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: '📱',
      title: 'OCR Receipt Processing',
      description: 'Automatically extract expense data from receipt images using AI.',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: '💱',
      title: 'Multi-Currency Support',
      description: 'Handle expenses in different currencies with real-time conversion.',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      icon: '🛡️',
      title: 'Secure & Transparent',
      description: 'Complete audit trail and secure authentication for all transactions.',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      icon: '⚡',
      title: 'Real-Time Updates',
      description: 'Instant notifications and status updates throughout the approval process.',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    }
  ];

  return (
    <section className="features" id="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">
            Complete Expense Management
            <span className="gradient-text"> Solution</span>
          </h2>
          <p className="features-description">
            Transform your expense reimbursement process with intelligent automation and seamless workflows.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" data-index={index}>
              <div className="feature-icon-wrapper">
                <div 
                  className="feature-icon-bg"
                  style={{ background: feature.gradient }}
                ></div>
                <span className="feature-icon">{feature.icon}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="features-cta">
          <div className="cta-content">
            <h3>Ready to Streamline Expenses?</h3>
            <p>Join companies already using ExpenseFlow for efficient expense management</p>
            <button className="cta-button">
              <span>Get Started Now</span>
              <svg className="button-arrow" viewBox="0 0 20 20">
                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
