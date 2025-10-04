import React from 'react';
import './Hero.css';

const Hero = ({ onGetStarted }) => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span>🚀 Odoo Hackathon 2024</span>
          </div>
          <h1 className="hero-title">
            Smart
            <span className="gradient-text"> Expense Management</span>
          </h1>
          <p className="hero-description">
            Streamline your expense reimbursement process with automated workflows, 
            multi-level approvals, and intelligent OCR receipt processing.
          </p>
          <div className="hero-actions">
            <button className="cta-primary" onClick={onGetStarted}>
              Get Started
              <svg className="button-icon" viewBox="0 0 20 20">
                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
              </svg>
            </button>
            <button className="cta-secondary">
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-graphic">
            <div className="floating-card card-1">
              <div className="card-icon">📊</div>
              <span>Analytics</span>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">⚡</div>
              <span>Fast</span>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">🔒</div>
              <span>Secure</span>
            </div>
            <div className="hero-circle"></div>
          </div>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="hero-bg">
        <div className="bg-grid"></div>
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
      </div>
    </section>
  );
};

export default Hero;
