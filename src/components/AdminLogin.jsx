import React, { useState } from 'react';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = ({ onAdminLogin, onClose }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'forgot-password', 'verify-otp', 'reset-password'
  
  // Additional states for forgot password flow
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const API_URL = 'http://localhost:5000/api';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleForgotPasswordInputChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      
      // Check if user is admin
      const userResponse = await axios.get(`${API_URL}/user/${credentials.email}`);
      if (userResponse.data.role !== 'admin') {
        setError('Access denied. Admin privileges required. Please contact system administrator to grant admin access.');
        setIsLoading(false);
        return;
      }

      onAdminLogin(userResponse.data);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/signup`, credentials);
      setError('');
      alert('Admin account created successfully! You can now login.');
      setCurrentView('login');
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/forgot-password`, { email: forgotPasswordData.email });
      setError('');
      alert('OTP sent to your email address.');
      setCurrentView('verify-otp');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/verify-otp`, {
        email: forgotPasswordData.email,
        otp: forgotPasswordData.otp
      });
      setError('');
      alert('OTP verified successfully!');
      setCurrentView('reset-password');
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/reset-password`, {
        email: forgotPasswordData.email,
        newPassword: forgotPasswordData.newPassword
      });
      setError('');
      alert('Password reset successfully! You can now login.');
      setCurrentView('login');
      setForgotPasswordData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFormHandler = () => {
    switch (currentView) {
      case 'login': return handleLogin;
      case 'signup': return handleSignup;
      case 'forgot-password': return handleForgotPassword;
      case 'verify-otp': return handleVerifyOTP;
      case 'reset-password': return handleResetPassword;
      default: return handleLogin;
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-modal">
        <div className="modal-header">
          <div className="header-content">
            <h2>Admin Access</h2>
            <p>Enter your admin credentials to access the admin panel</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <div className="error-text">
                {error}
                {error.includes('Admin privileges required') && (
                  <div className="error-help">
                    <br />
                    <strong>Need admin access?</strong><br />
                    Run: <code>node add-admin-user.js</code> in backend folder
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={getFormHandler()}>
            {currentView === 'login' && (
              <>
                <div className="form-group">
                  <label>Admin Email</label>
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleInputChange}
                    placeholder="admin@company.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button type="submit" className="login-btn" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In as Admin'}
                </button>
              </>
            )}

            {currentView === 'signup' && (
              <>
                <div className="form-group">
                  <label>Admin Email</label>
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleInputChange}
                    placeholder="admin@company.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    required
                  />
                </div>
                <button type="submit" className="signup-btn" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Admin Account'}
                </button>
              </>
            )}

            {currentView === 'forgot-password' && (
              <>
                <div className="form-group">
                  <label>Admin Email</label>
                  <input
                    type="email"
                    name="email"
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordInputChange}
                    placeholder="admin@company.com"
                    required
                  />
                </div>
                <button type="submit" className="forgot-btn" disabled={isLoading}>
                  {isLoading ? 'Sending OTP...' : 'Send Reset Code'}
                </button>
              </>
            )}

            {currentView === 'verify-otp' && (
              <>
                <div className="form-group">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    name="otp"
                    value={forgotPasswordData.otp}
                    onChange={handleForgotPasswordInputChange}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    required
                  />
                </div>
                <button type="submit" className="verify-btn" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>
              </>
            )}

            {currentView === 'reset-password' && (
              <>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={forgotPasswordData.newPassword}
                    onChange={handleForgotPasswordInputChange}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={forgotPasswordData.confirmPassword}
                    onChange={handleForgotPasswordInputChange}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <button type="submit" className="reset-btn" disabled={isLoading}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </>
            )}
          </form>

          <div className="modal-footer">
            {currentView === 'login' && (
              <>
                <button 
                  type="button" 
                  className="link-btn"
                  onClick={() => setCurrentView('signup')}
                >
                  Create Admin Account
                </button>
                <button 
                  type="button" 
                  className="link-btn"
                  onClick={() => setCurrentView('forgot-password')}
                >
                  Forgot Password?
                </button>
              </>
            )}
            {currentView === 'signup' && (
              <button 
                type="button" 
                className="link-btn"
                onClick={() => setCurrentView('login')}
              >
                Already have an account? Sign In
              </button>
            )}
            {(currentView === 'forgot-password' || currentView === 'verify-otp' || currentView === 'reset-password') && (
              <button 
                type="button" 
                className="link-btn"
                onClick={() => setCurrentView('login')}
              >
                ← Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
